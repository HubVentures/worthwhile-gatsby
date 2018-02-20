import * as React from 'react';
import { Icon, Input } from 'elmnt';
import { clickOutside, compose, enclose } from 'mishmash';

import { colors, icons } from '../../styles';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: '#bbb',
  fontWeight: 'bold' as 'bold',
};

export default compose(
  enclose(({ initialProps, onProps, setState, methods }) => {
    let inputElem1;
    const setInputElem1 = e => (inputElem1 = e);
    let inputElem2;
    const setInputElem2 = e => (inputElem2 = e);

    initialProps.context.store.watch(
      props => `${props.path}_start`,
      (start = 1) => setState({ start }),
      onProps,
      initialProps,
    );
    initialProps.context.store.watch(
      props => `${props.path}_end`,
      (end = null) => setState({ end }),
      onProps,
      initialProps,
    );

    let diff = initialProps.end
      ? initialProps.end - (initialProps.start + 1)
      : null;
    return (props, { start, end }) => {
      const invalid = start && end && start > end;
      return {
        ...props,
        start,
        end,
        invalid,
        ...methods({
          onChangeStart: v => {
            props.context.store.set(`${props.path}_start`, v);
            if (v && end) {
              props.context.store.set(
                `${props.path}_end`,
                Math.max(v + diff, 1),
              );
            }
          },
          onChangeEnd: v => {
            props.context.store.set(`${props.path}_end`, v);
            diff = start && v ? v - start : null;
          },
          onMouseMove: () =>
            props.context.setActive({ type: 'paging', path: props.path }),
          onMouseLeave: () => props.context.setActive(null),
          onClick: e => {
            props.context.setActive({ type: 'paging', path: props.path }, true);
            if (e.clientY - e.target.getBoundingClientRect().top <= 44) {
              inputElem1 && inputElem1.focus();
            } else {
              inputElem2 && inputElem2.focus();
            }
          },
          onClickOutside: () => {
            if (props.focused) {
              if (!invalid) {
                if (!start) props.context.store.set(`${props.path}_start`, 1);
                if (end === 0)
                  props.context.store.set(`${props.path}_end`, null);
                props.context.query.page(
                  props.path,
                  start ? start - 1 : 0,
                  end,
                );
                props.context.setActive(null, true);
              }
              return true;
            }
          },
          onKeyDown: event => {
            if (props.focused && event.keyCode === 13) {
              if (!invalid) {
                if (!start) props.context.store.set(`${props.path}_start`, 1);
                if (end === 0)
                  props.context.store.set(`${props.path}_end`, null);
                props.context.query.page(
                  props.path,
                  start ? start - 1 : 0,
                  end,
                );
                props.context.setActive(null, true);
                (document.activeElement as HTMLElement).blur();
              }
            }
          },
        }),
        setInputElem1,
        setInputElem2,
      };
    };
  }),
  clickOutside(props => props.onClickOutside(), 'setClickElem'),
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
    setClickElem,
    onKeyDown,
    setInputElem1,
    setInputElem2,
  }) => (
    <>
      <div
        onKeyDown={onKeyDown}
        style={{ position: 'relative', margin: -5, zIndex: focused ? 20 : 6 }}
        ref={setClickElem}
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
      </div>
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
