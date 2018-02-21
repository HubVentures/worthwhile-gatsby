import * as React from 'react';
import { css, Div, Icon, Input } from 'elmnt';
import { clickOutside, compose, enclose, map, restyle } from 'mishmash';

import icons from '../icons';

export default compose(
  enclose(({ initialProps, onProps, setState, methods }) => {
    let inputElem;
    const setInputElem = e => (inputElem = e);

    let filter;
    initialProps.context.store.watch(
      props => `${props.path}_filter`,
      (text = '') => setState({ text }),
      onProps,
      initialProps,
    );

    return (props, { text }) => {
      const invalid = text && !filter;
      return {
        ...props,
        text,
        invalid,
        ...methods({
          setText: text => {
            filter = props.context.config.parseFilter(text, props.type);
            props.context.store.set(`${props.path}_filter`, text);
          },
          onMouseMove: () =>
            props.context.setActive({ type: 'filter', path: props.path }),
          onMouseLeave: () => props.context.setActive(null),
          onClick: () => {
            props.context.setActive({ type: 'filter', path: props.path }, true);
            inputElem && inputElem.focus();
          },
          onClickOutside: () => {
            if (props.focused) {
              if (!invalid) {
                props.context.query.filter(props.path, filter);
                props.context.setActive(null, true);
              }
              return true;
            }
          },
          onKeyDown: event => {
            if (props.focused && event.keyCode === 13 && !invalid) {
              props.context.query.filter(props.path, filter);
              props.context.setActive(null, true);
              (document.activeElement as HTMLElement).blur();
            }
          },
        }),
        setInputElem,
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
          ['filter', 'margin', 'background'],
          ['merge', { position: 'relative' }],
        ],
        bar: [
          ['scale', { minWidth: { fontSize: 5 } }],
          ['filter', 'minWidth'],
          [
            'merge',
            { layout: 'bar', position: 'relative', zIndex: focused ? 20 : 5 },
          ],
        ],
        filterIcon: [
          ['scale', { fontSize: 0.8 }],
          ['filter', 'color', 'fontSize', 'padding'],
        ],
        iconWidth: [
          [
            'scale',
            { width: { fontSize: 0.8, paddingLeft: 0.5, paddingRight: 0.5 } },
          ],
        ],
        text: [
          ['filter', ...css.groups.text, 'padding'],
          ['scale', { paddingRight: 2 }],
        ],
      },
    })),
  ),
  clickOutside(props => props.onClickOutside(), 'setClickElem'),
)(
  ({
    live,
    text,
    setText,
    focused,
    onMouseMove,
    onMouseLeave,
    onClick,
    setClickElem,
    onKeyDown,
    setInputElem,
    style,
  }) => (
    <div onKeyDown={onKeyDown} style={style.div} ref={setClickElem}>
      <Div style={style.bar}>
        <div style={{ width: style.iconWidth.width }}>
          <Icon {...icons.filter} style={style.filterIcon} />
        </div>
        <Input
          type="string"
          value={text}
          onChange={setText}
          spellCheck={false}
          style={style.text}
          ref={setInputElem}
        />
      </Div>
      {live &&
        !focused && (
          <div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={{
              position: 'absolute',
              top:
                -(style.base.paddingTop + style.div.marginTop) -
                style.base.borderTopWidth -
                style.icon.radius,
              right:
                -(style.base.paddingRight + style.div.marginRight) -
                style.base.borderRightWidth,
              bottom:
                -(style.base.paddingBottom + style.div.marginBottom) -
                style.base.borderBottomWidth,
              left:
                -(style.base.paddingLeft + style.div.marginLeft) -
                style.base.borderLeftWidth,
              cursor: 'pointer',
              // background: 'rgba(255,0,0,0.1)',
              zIndex: 5,
            }}
          />
        )}
    </div>
  ),
);
