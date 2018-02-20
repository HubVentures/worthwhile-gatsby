import * as React from 'react';
import { Div, Icon, Input } from 'elmnt';
import { clickOutside, compose, context, enclose } from 'mishmash';
import { parseFilter } from 'common-client';

import { colors, icons } from '../../styles';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: colors.black,
};

export default compose(
  context('store'),
  enclose(({ initialProps, onProps, setState, methods }) => {
    let inputElem;
    const setInputElem = e => (inputElem = e);

    let filter;
    initialProps.store.watch(
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
            filter = parseFilter(text, props.type);
            props.store.set(`${props.path}_filter`, text);
          },
          onMouseMove: () =>
            props.setActive({ type: 'filter', path: props.path }),
          onMouseLeave: () => props.setActive(null),
          onClick: () => {
            props.setActive({ type: 'filter', path: props.path }, true);
            inputElem && inputElem.focus();
          },
          onClickOutside: () => {
            if (props.focused) {
              if (!invalid) {
                props.updateFilter(props.path, filter);
                props.setActive(null, true);
              }
              return true;
            }
          },
          onKeyDown: event => {
            if (props.focused && event.keyCode === 13 && !invalid) {
              props.updateFilter(props.path, filter);
              props.setActive(null, true);
              (document.activeElement as HTMLElement).blur();
            }
          },
        }),
        setInputElem,
      };
    };
  }),
  clickOutside(props => props.onClickOutside(), 'setClickElem'),
)(
  ({
    live,
    text,
    invalid,
    setText,
    active,
    focused,
    onMouseMove,
    onMouseLeave,
    onClick,
    setClickElem,
    onKeyDown,
    setInputElem,
  }) => (
    <div
      onKeyDown={onKeyDown}
      style={{ position: 'relative', margin: -5 }}
      ref={setClickElem}
    >
      <Div
        style={{
          layout: 'bar',
          background: focused
            ? invalid ? colors.red : colors.blue
            : active && 'rgba(0,0,0,0.1)',
          minWidth: 50,
          position: 'relative',
          zIndex: focused ? 20 : 5,
        }}
      >
        <div style={{ width: 20 }}>
          <Icon
            {...icons.filter}
            style={{
              fontSize: 10,
              color: focused
                ? colors.white
                : active ? colors.blue : 'rgba(0,0,0,0.3)',
              padding: 5,
            }}
          />
        </div>
        <Input
          type="string"
          value={text}
          onChange={setText}
          spellCheck={false}
          style={{
            ...textStyle,
            fontWeight: 'bold',
            color: focused
              ? colors.white
              : active ? colors.blue : 'rgba(0,0,0,0.3)',
            padding: '5px 10px 5px 5px',
          }}
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
              top: -11,
              right: -5,
              bottom: -6,
              left: -5,
              cursor: 'pointer',
              // background: 'rgba(255,0,0,0.1)',
              zIndex: 5,
            }}
          />
        )}
    </div>
  ),
);
