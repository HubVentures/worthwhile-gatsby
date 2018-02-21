import * as React from 'react';
import { css, Icon, Input } from 'elmnt';
import { clickOutside, compose, enclose, map, restyle } from 'mishmash';

import icons from '../icons';

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
  map(
    restyle(['active', 'focused', 'invalid'], (active, focused, invalid) => ({
      base: {
        input: [
          [
            'mergeKeys',
            { input: true, hover: active, focus: focused, invalid },
          ],
        ],
      },
    })),
    restyle(['focused'], focused => ({
      input: {
        div: [
          ['scale', { margin: { padding: -1 } }],
          ['filter', 'margin'],
          ['merge', { position: 'relative', zIndex: focused ? 20 : 6 }],
        ],
        text: [
          ['filter', ...css.groups.text, 'padding', 'background'],
          ['scale', { minWidth: { fontSize: 2 } }],
          ['merge', { display: 'inline-block', verticalAlign: 'top' }],
        ],
        arrow: [
          ['mergeKeys', 'connect'],
          [
            'scale',
            {
              fontSize: 0.9,
              paddingTop: 0,
              paddingBottom: 0,
              minWidth: { fontSize: 2 },
            },
          ],
          ['filter', 'fontSize', 'color', 'padding', 'minWidth'],
        ],
      },
    })),
  ),
  clickOutside(props => props.onClickOutside(), 'setClickElem'),
)(
  ({
    live,
    start,
    end,
    onChangeStart,
    onChangeEnd,
    focused,
    onMouseMove,
    onMouseLeave,
    onClick,
    setClickElem,
    onKeyDown,
    setInputElem1,
    setInputElem2,
    style,
  }) => (
    <>
      <div onKeyDown={onKeyDown} style={style.div} ref={setClickElem}>
        <Input
          type="int"
          value={start}
          onChange={onChangeStart}
          style={style.text}
          ref={setInputElem1}
        />
        <Icon {...icons.down} style={style.arrow} />
        <Input
          type="int"
          value={end}
          onChange={onChangeEnd}
          style={style.text}
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
              top: -style.base.borderTopWidth * 2 - style.icon.radius,
              right: -style.base.borderRightWidth,
              bottom: -style.base.borderBottomWidth * 2,
              left: -style.base.borderLeftWidth,
              zIndex: 6,
              cursor: 'pointer',
              // background: 'rgba(255,0,0,0.1)',
            }}
          />
        )}
    </>
  ),
);
