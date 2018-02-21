import * as React from 'react';
import { Div, Icon, Txt } from 'elmnt';
import {
  clickOutside,
  compose,
  enclose,
  fitScreen,
  map,
  renderLifted,
  restyle,
  withHover,
} from 'mishmash';
import { root } from 'common';

import icons from '../icons';

const Item = compose(
  enclose(({ methods }) => props => ({
    ...props,
    ...methods({ onClick: () => props.onClick(props.field) }),
  })),
  withHover,
  map(
    restyle(['relation', 'isHovered'], (relation, isHovered) => [
      ['mergeKeys', { item: true, relation, hover: isHovered }],
      ['merge', { border: 'none', cursor: 'pointer' }],
    ]),
  ),
)(({ context, type, field, onClick, hoverProps, style }) => (
  <Txt onClick={onClick} {...hoverProps} style={style}>
    {type ? context.config.fieldName(field, type) : context.types[field]}
  </Txt>
));

export default compose(
  map(
    restyle({
      base: {
        modal: [['mergeKeys', 'modal'], ['filter', 'background', 'padding']],
      },
    }),
  ),
  enclose(({ methods }) => ({ path, ...props }) => ({
    ...props,
    ...methods({
      onMouseMove: () => props.context.setActive({ type: 'add', path }),
      onMouseLeave: () => props.context.setActive(null),
      onClick: () => props.context.setActive({ type: 'add', path }, true),
      onClickItem: field => {
        props.context.query.add(path, props.type, field);
        props.context.setActive(null, true);
      },
    }),
  })),
  clickOutside(props => {
    if (props.focused) {
      props.context.setActive(null, true);
      return true;
    }
  }, 'setClickElem'),
  renderLifted(
    fitScreen(({ liftBounds: { top, left, height, width } }) => ({
      base: { top: top + height, left: left + width * 0.5 - 100, width: 203 },
      gap: 4,
    }))(
      ({
        context,
        type,
        onClickItem,
        setClickElem,
        setInnerElem,
        fitStyle,
        fitSmall,
        style,
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
              <Div style={style.modal}>
                {(type
                  ? ['id', ...Object.keys(root.rgo.schema[type])]
                  : Object.keys(context.types)
                ).map((f, i) => (
                  <Item
                    context={context}
                    type={type}
                    field={f}
                    relation={
                      f !== 'id' &&
                      (!type || (root.rgo.schema[type][f] as any).type)
                    }
                    onClick={onClickItem}
                    style={style.base}
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
    style,
  }) => (
    <>
      {(active || focused) && (
        <>
          <div
            style={{
              position: 'absolute',
              ...(wide
                ? {
                    right: 0,
                    bottom: 0,
                    left: 0,
                    height: style.base.borderBottomWidth * 3,
                  }
                : {
                    top: 0,
                    left: -style.base.borderLeftWidth,
                    bottom: 0,
                    width: style.base.borderLeftWidth * 3,
                  }),
              background: !empty && style.icon.background,
            }}
            ref={setLiftBaseElem}
          />
          {!empty && (
            <Icon
              {...icons.plus}
              style={{
                ...style.icon,
                position: 'absolute',
                ...(wide
                  ? {
                      left: '50%',
                      marginLeft: -style.icon.radius,
                      bottom: style.base.borderBottomWidth,
                    }
                  : {
                      bottom: '50%',
                      left: -style.icon.radius,
                      marginBottom: -style.icon.radius,
                    }),
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
          top: -style.icon.radius,
          left: wide ? 0 : -style.base.paddingLeft,
          right: wide ? 0 : -style.base.paddingRight,
          bottom: 0,
          cursor: 'pointer',
          // background: 'rgba(0,255,0,0.1)',
        }}
      />
    </>
  ),
);
