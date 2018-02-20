import * as React from 'react';
import { Div, Icon, Txt } from 'elmnt';
import {
  clickOutside,
  compose,
  enclose,
  fitScreen,
  renderLifted,
  withHover,
} from 'mishmash';
import { root } from 'common';

import { colors, icons } from '../../styles';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: colors.black,
};

const getFieldName = (types, type, field) => {
  if (field === 'id') return 'Id';
  if (types[field]) return types[field];
  if (!type || !root.rgo.schema[type][field]) return field;
  return root.rgo.schema[type][field].meta.name || field;
};

const Item = compose(
  enclose(({ methods }) => props => ({
    ...props,
    ...methods({ onClick: () => props.onClick(props.field) }),
  })),
  withHover,
)(({ types, type, field, relation, onClick, hoverProps, isHovered }) => (
  <Txt
    onClick={onClick}
    {...hoverProps}
    style={{
      ...textStyle,
      fontWeight: relation ? 'bold' : 'normal',
      padding: '7px 14px',
      cursor: 'pointer',
      ...(isHovered
        ? {
            background: colors.blue,
            color: colors.white,
          }
        : {}),
    }}
  >
    {getFieldName(types, type, field)}
  </Txt>
));

export default compose(
  enclose(({ methods }) => ({ path, ...props }) => ({
    ...props,
    ...methods({
      onMouseMove: () => props.setActive({ type: 'add', path }),
      onMouseLeave: () => props.setActive(null),
      onClick: () => props.setActive({ type: 'add', path }, true),
      onClickItem: field => {
        props.clickAdd(path, props.type, field);
        props.setActive(null, true);
      },
    }),
  })),
  clickOutside(props => {
    if (props.focused) {
      props.setActive(null, true);
      return true;
    }
  }, 'setClickElem'),
  renderLifted(
    fitScreen(({ liftBounds: { top, left, height, width } }) => ({
      base: { top: top + height, left: left + width * 0.5 - 100, width: 203 },
      gap: 4,
    }))(
      ({
        types,
        type,
        onClickItem,
        setClickElem,
        setInnerElem,
        fitStyle,
        fitSmall,
      }) => (
        <div>
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: fitSmall ? 'rgba(0,0,0,0.5)' : 'none',
              zIndex: 99999,
            }}
          />
          <div
            style={{
              ...fitStyle,
              boxShadow: fitSmall
                ? '0 2px 25px rgba(0,0,0,0.5)'
                : '0 2px 20px 5px rgba(0,0,0,0.4)',
              zIndex: 99999,
            }}
            ref={setClickElem}
          >
            <div ref={setInnerElem}>
              <Div style={{ background: 'white', padding: '4px 0' }}>
                {(type
                  ? ['id', ...Object.keys(root.rgo.schema[type])]
                  : Object.keys(types)
                ).map((f, i) => (
                  <Item
                    types={types}
                    type={type}
                    field={f}
                    relation={
                      f !== 'id' &&
                      (!type || (root.rgo.schema[type][f] as any).type)
                    }
                    onClick={onClickItem}
                    key={i}
                  />
                ))}
              </Div>
            </div>
          </div>
        </div>
      ),
    ),
    ({ focused }) => focused,
  ),
)(
  ({
    wide,
    setLiftBaseElem,
    active,
    focused,
    onMouseMove,
    onMouseLeave,
    onClick,
    empty,
  }) => (
    <>
      {(active || focused) && (
        <>
          <div
            style={{
              position: 'absolute',
              ...(wide
                ? { right: 0, bottom: 0, left: 0, height: 3 }
                : { top: 0, left: -1, bottom: 0, width: 3 }),
              background: !empty && colors.blue,
            }}
            ref={setLiftBaseElem}
          />
          {!empty && (
            <Icon
              {...icons.plus}
              style={{
                fontSize: 7,
                background: colors.blue,
                color: 'white',
                borderRadius: 10,
                padding: 2,
                position: 'absolute',
                ...(wide
                  ? { left: '50%', marginLeft: -6, bottom: 1 }
                  : { top: '50%', left: -5, marginTop: -6 }),
              }}
            />
          )}
        </>
      )}
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        style={{
          position: 'absolute',
          top: -5,
          left: wide ? 0 : -10,
          right: wide ? 0 : -10,
          bottom: 0,
          cursor: 'pointer',
          // background: 'rgba(0,255,0,0.1)',
        }}
      />
    </>
  ),
);
