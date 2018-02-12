import * as React from 'react';
import { Div, Icon, Txt } from 'elmnt';
import {
  compose,
  enclose,
  fitScreen,
  methodWrap,
  renderLifted,
} from 'mishmash';

import { colors, icons } from '../styles';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: colors.black,
};

export default compose(
  enclose(
    ({ setState }) => {
      const setOpen = () => setState({ isOpen: true });
      const setClosed = () => setState({ isOpen: false });
      return (props, { isOpen }) => ({ ...props, isOpen, setOpen, setClosed });
    },
    { isOpen: false },
  ),
  renderLifted(
    fitScreen(({ liftBounds: { top, left, height } }) => ({
      base: { top: top + height, left: left - 100, width: 203 },
      gap: 4,
    }))(({ type, setClosed, setInnerElem, fitStyle, fitSmall }) => (
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
            <Div style={{ spacing: 8, padding: 8, background: 'white' }}>
              {(type
                ? Object.keys(window.rgo.schema[type])
                : Object.keys(window.rgo.schema)
              ).map((f, i) => (
                <Txt style={textStyle} key={i}>
                  {f}
                </Txt>
              ))}
            </Div>
          </div>
        </div>
      </div>
    )),
    ({ isOpen }) => isOpen,
  ),
  enclose(() => ({ path, ...props }) => {
    const methods = methodWrap();
    return {
      ...props,
      ...methods({
        onMouseMove: () => props.setActive({ type: 'add', path }),
        onMouseLeave: () => props.setActive(null),
      }),
    };
  }),
)(({ isOpen, setOpen, setLiftBaseElem, active, onMouseMove, onMouseLeave }) => (
  <>
    {(active || isOpen) && (
      <>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: -1,
            bottom: 0,
            width: 3,
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
            top: '50%',
            marginTop: -6,
            left: -5,
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
        top: -11,
        left: -11,
        right: -11,
        bottom: -11,
        cursor: 'pointer',
        // background: 'rgba(0,255,0,0.1)',
      }}
    />
  </>
));
