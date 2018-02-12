import * as React from 'react';
import { Icon, Input } from 'elmnt';
import { enclose, methodWrap, Outside } from 'mishmash';

import { colors, icons } from '../styles';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: '#bbb',
  fontWeight: 'bold' as 'bold',
};

export default enclose(
  ({ onProps, setState }) => {
    let inputElem1;
    const setInputElem1 = e => (inputElem1 = e);
    let inputElem2;
    const setInputElem2 = e => (inputElem2 = e);
    const onChange1 = v => setState({ value1: v });
    const onChange2 = v => setState({ value2: v });
    onProps(props => {
      if (props && !props.focused) {
        setState({ value1: props.start, value2: props.end });
      }
    });
    const methods = methodWrap();
    return ({ path, ...props }, { value1, value2 }) => {
      const invalid = !value1 || (value2 && value1 >= value2);
      return {
        ...props,
        value1,
        value2,
        onChange1,
        onChange2,
        invalid,
        ...methods({
          onMouseMove: () => props.setActive({ type: 'paging', path }),
          onMouseLeave: () => props.setActive(null),
          onClick: e => {
            props.setActive({ type: 'paging', path }, true);
            if (e.clientY - e.target.getBoundingClientRect().top <= 44) {
              inputElem1 && inputElem1.focus();
            } else {
              inputElem2 && inputElem2.focus();
            }
          },
          onClickOutside: e => {
            if (props.focused) {
              e.stopPropagation();
              if (!invalid) {
                props.updatePaging(path, value1, value2);
                props.setActive(null, true);
              }
            }
          },
          onKeyDown: event => {
            if (props.focused && event.keyCode === 13) {
              if (!invalid) {
                props.updatePaging(path, value1, value2);
                props.setActive(null, true);
                (document.activeElement as HTMLElement).blur();
              }
            }
          },
        }),
        setInputElem1,
        setInputElem2,
      };
    };
  },
  props => ({ value1: props.start, value2: props.end }),
)(
  ({
    value1,
    onChange1,
    value2,
    onChange2,
    invalid,
    active,
    focused,
    onMouseMove,
    onMouseLeave,
    onClick,
    onClickOutside,
    onKeyDown,
    setInputElem1,
    setInputElem2,
  }) => (
    <>
      <Outside
        onClickOutside={onClickOutside}
        onKeyDown={onKeyDown}
        style={{ padding: '5px 4px 4px 5px' }}
      >
        <div style={{ position: 'relative', zIndex: focused ? 25 : 12 }}>
          <Input
            type="int"
            value={value1}
            onChange={onChange1}
            style={{
              ...textStyle,
              color: focused
                ? colors.white
                : active ? colors.blue : 'rgba(0,0,0,0.3)',
              padding: 5,
              background: focused
                ? invalid ? colors.red : colors.blue
                : active && 'rgba(0,0,0,0.1)',
              display: 'inline-block',
              verticalAlign: 'top',
              minWidth: 30,
            }}
            ref={setInputElem1}
          />
          <Icon
            {...icons.down}
            style={{
              color:
                focused || active
                  ? invalid ? colors.red : colors.blue
                  : 'rgba(0,0,0,0.3)',
              fontSize: 11,
              padding: '0 5px',
              minWidth: 30,
            }}
          />
          <Input
            type="int"
            value={value2}
            onChange={onChange2}
            style={{
              ...textStyle,
              color: focused
                ? colors.white
                : active ? colors.blue : 'rgba(0,0,0,0.3)',
              padding: 5,
              background: focused
                ? invalid ? colors.red : colors.blue
                : active && 'rgba(0,0,0,0.1)',
              display: 'inline-block',
              verticalAlign: 'top',
              minWidth: 30,
            }}
            ref={setInputElem2}
          />
        </div>
      </Outside>
      {!focused && (
        <div
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
          style={{
            position: 'absolute',
            top: -11,
            right: 4,
            bottom: -13,
            left: 5,
            zIndex: 12,
            cursor: 'pointer',
            // background: 'rgba(0,0,255,0.1)',
          }}
        />
      )}
    </>
  ),
);
