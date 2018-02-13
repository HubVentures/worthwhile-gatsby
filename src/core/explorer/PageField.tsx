import * as React from 'react';
import { Icon, Input } from 'elmnt';
import { compose, context, enclose, methodWrap, Outside } from 'mishmash';

import { colors, icons } from '../styles';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: '#bbb',
  fontWeight: 'bold' as 'bold',
};

export default compose(
  context('store'),
  enclose(
    ({ initialProps, onProps, setState }) => {
      let inputElem1;
      const setInputElem1 = e => (inputElem1 = e);
      let inputElem2;
      const setInputElem2 = e => (inputElem2 = e);
      let path;
      let unlistens;
      const update = props => {
        if (props) {
          if (props.path !== path) {
            path = props.path;
            unlistens && unlistens.forEach(u => u());
            unlistens = [
              props.store.listen(`${path}_start`, (start = null) =>
                setState({ start }),
              ),
              props.store.listen(`${path}_end`, (end = null) =>
                setState({ end }),
              ),
            ];
          }
          if (props.live && !props.focused) {
            props.store.set(`${path}_start`, props.start);
            props.store.set(`${path}_end`, props.end);
          }
        } else {
          unlistens.forEach(u => u());
        }
      };
      update(initialProps);
      onProps(update);
      const methods = methodWrap();
      return (props, { start, end }) => {
        const invalid = !start || (end && start >= end);
        return {
          ...props,
          start,
          end,
          invalid,
          ...methods({
            onChangeStart: v => props.store.set(`${path}_start`, v),
            onChangeEnd: v => props.store.set(`${path}_end`, v),
            onMouseMove: () =>
              props.setActive({ type: 'paging', path: props.path }),
            onMouseLeave: () => props.setActive(null),
            onClick: e => {
              props.setActive({ type: 'paging', path: props.path }, true);
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
                  props.updatePaging(props.path, start, end);
                  props.setActive(null, true);
                }
              }
            },
            onKeyDown: event => {
              if (props.focused && event.keyCode === 13) {
                if (!invalid) {
                  props.updatePaging(props.path, start, end);
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
    { start: null as null | number, end: null as null | number },
  ),
)(
  ({
    live,
    start,
    end,
    onChangeStart,
    onChangeEnd,
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
        style={{ position: 'relative', margin: -5, zIndex: focused ? 20 : 6 }}
      >
        <Input
          type="int"
          value={start}
          onChange={onChangeStart}
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
            minWidth: 25,
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
            minWidth: 25,
          }}
        />
        <Input
          type="int"
          value={end}
          onChange={onChangeEnd}
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
            minWidth: 25,
          }}
          ref={setInputElem2}
        />
      </Outside>
      {live &&
        !focused && (
          <div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={{
              position: 'absolute',
              top: -7,
              right: 0,
              bottom: -2,
              left: -1,
              zIndex: 6,
              cursor: 'pointer',
              // background: 'rgba(255,0,0,0.1)',
            }}
          />
        )}
    </>
  ),
);
