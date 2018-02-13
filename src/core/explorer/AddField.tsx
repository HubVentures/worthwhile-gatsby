import * as React from 'react';
import { Div, Icon, Txt } from 'elmnt';
import {
  compose,
  enclose,
  fitScreen,
  methodWrap,
  renderLifted,
  withHover,
} from 'mishmash';

import { colors, icons } from '../styles';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: colors.black,
};

const Item = compose(
  enclose(() => {
    const methods = methodWrap();
    return props => ({
      ...props,
      ...methods({
        onClick: () => props.onClick(props.field),
      }),
    });
  }),
  withHover,
)(({ field, relation, onClick, hoverProps, isHovered }) => (
  <Txt
    onClick={onClick}
    {...hoverProps}
    style={{
      ...textStyle,
      fontWeight: relation ? 'bold' : 'normal',
      padding: '5px 10px',
      cursor: 'pointer',
      ...(isHovered
        ? {
            background: colors.blue,
            color: colors.white,
          }
        : {}),
    }}
  >
    {field}
  </Txt>
));

export default compose(
  enclose(
    ({ setState }) => {
      const setOpen = () => setState({ isOpen: true });
      const setClosed = () => setState({ isOpen: false });
      const methods = methodWrap();
      return (props, { isOpen }) => ({
        ...props,
        isOpen,
        setOpen,
        setClosed,
        ...methods({
          onClick: field => {
            props.clickAdd(props.path, props.type, field);
            setClosed();
            props.setActive(null);
          },
        }),
      });
    },
    { isOpen: false },
  ),
  renderLifted(
    fitScreen(({ liftBounds: { top, left, height, width } }) => ({
      base: { top: top + height, left: left + width * 0.5 - 100, width: 203 },
      gap: 4,
    }))(({ type, setClosed, onClick, setInnerElem, fitStyle, fitSmall }) => (
      <div>
        <div
          onClick={setClosed}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: fitSmall ? 'rgba(0,0,0,0.5)' : 'none',
          }}
        />
        <div
          style={{
            ...fitStyle,
            boxShadow: fitSmall
              ? '0 2px 25px rgba(0,0,0,0.5)'
              : '0 2px 20px 5px rgba(0,0,0,0.4)',
          }}
        >
          <div ref={setInnerElem}>
            <Div style={{ background: 'white', padding: '4px 0' }}>
              {(type
                ? Object.keys(window.rgo.schema[type])
                : Object.keys(window.rgo.schema)
              ).map((f, i) => (
                <Item
                  field={f}
                  relation={!type || (window.rgo.schema[type][f] as any).type}
                  onClick={onClick}
                  key={i}
                />
              ))}
            </Div>
          </div>
        </div>
      </div>
    )),
    ({ isOpen }) => isOpen,
  ),
  enclose(() => {
    const methods = methodWrap();
    return ({ path, ...props }) => ({
      ...props,
      ...methods({
        onMouseMove: () => props.setActive({ type: 'add', path }),
        onMouseLeave: () => props.setActive(null),
      }),
    });
  }),
)(
  ({
    wide,
    isOpen,
    setOpen,
    setLiftBaseElem,
    active,
    onMouseMove,
    onMouseLeave,
    firstCol,
    lastCol,
  }) => (
    <>
      {(active || isOpen) && (
        <>
          <div
            style={{
              position: 'absolute',
              ...(wide
                ? { right: 0, bottom: 0, left: 0, height: 3 }
                : { top: 0, left: -1, bottom: 0, width: 3 }),
              background: colors.blue,
            }}
            ref={setLiftBaseElem}
          />
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
                : {
                    top: '50%',
                    left: firstCol ? 0 : lastCol ? -10 : -5,
                    marginTop: -6,
                  }),
            }}
          />
        </>
      )}
      <div
        onClick={setOpen}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'absolute',
          top: -5,
          left: wide ? 0 : firstCol ? -1 : -10,
          right: wide ? 0 : lastCol ? -1 : -10,
          bottom: 0,
          cursor: 'pointer',
          // background: 'rgba(0,255,0,0.1)',
        }}
      />
    </>
  ),
);
