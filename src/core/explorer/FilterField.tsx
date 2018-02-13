import * as React from 'react';
import { Div, Icon, Input } from 'elmnt';
import { compose, context, enclose, methodWrap, Outside } from 'mishmash';
import { getValueString, Obj, root } from 'common';
import { parseFilter } from 'common-client';
import { Field, fieldIs } from 'rgo';

import { colors, icons } from '../styles';

const printFilter = (filter: any[] | null, fields: Obj<Field>) => {
  if (!filter) return '';
  if (filter[0] === 'AND' || filter[0] === 'OR') {
    return `(${filter
      .slice(1)
      .map(f => printFilter(f, fields))
      .join(filter[0] === 'AND' ? ', ' : ' OR ')})`;
  }
  const field = fields[filter[0]];
  if (!field || !fieldIs.scalar(field)) throw new Error('Invalid field');
  const op = filter.length === 3 ? filter[1] : '=';
  const value = filter[filter.length - 1];
  return `${filter[0]} ${op} ${getValueString(value, field.scalar)}`;
};

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: colors.black,
};

export default compose(
  context('store'),
  enclose(
    ({ initialProps, onProps, setState }) => {
      let inputElem;
      const setInputElem = e => (inputElem = e);
      let prevFilter;
      let path;
      let unlisten;
      const update = props => {
        if (props) {
          if (props.path !== path) {
            path = props.path;
            unlisten && unlisten();
            unlisten = props.store.listen(`${path}_filter`, text =>
              setState({ text }),
            );
          }
          if (props.live && !props.focused && props.filter !== prevFilter) {
            prevFilter = props.filter;
            const text = printFilter(props.filter, root.rgo.schema[props.type]);
            props.store.set(`${path}_filter`, text);
          }
        } else {
          unlisten();
        }
      };
      update(initialProps);
      onProps(update);
      const methods = methodWrap();
      return (props, { text }) => {
        const invalid = text && !prevFilter;
        return {
          ...props,
          text,
          invalid,
          ...methods({
            setText: text => {
              prevFilter = parseFilter(text, props.type);
              props.store.set(`${path}_filter`, text);
            },
            onMouseMove: () =>
              props.setActive({ type: 'filter', path: props.path }),
            onMouseLeave: () => props.setActive(null),
            onClick: () => {
              props.setActive({ type: 'filter', path: props.path }, true);
              inputElem && inputElem.focus();
            },
            onClickOutside: e => {
              if (props.focused) {
                e.stopPropagation();
                if (!invalid) {
                  props.updateFilter(props.path, prevFilter);
                  props.setActive(null, true);
                }
              }
            },
            onKeyDown: event => {
              if (props.focused && event.keyCode === 13 && !invalid) {
                props.updateFilter(props.path, prevFilter);
                props.setActive(null, true);
                (document.activeElement as HTMLElement).blur();
              }
            },
          }),
          setInputElem,
        };
      };
    },
    { text: '' },
  ),
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
    onClickOutside,
    onKeyDown,
    setInputElem,
  }) => (
    <Outside
      onClickOutside={onClickOutside}
      onKeyDown={onKeyDown}
      style={{ position: 'relative', margin: -5 }}
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
    </Outside>
  ),
);
