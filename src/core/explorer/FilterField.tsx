import * as React from 'react';
import { Div, Icon, Input } from 'elmnt';
import { enclose, methodWrap, Outside } from 'mishmash';
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

export default enclose(
  ({ initialProps, onProps, setState }) => {
    let inputElem;
    const setInputElem = e => (inputElem = e);
    let prevFilter = initialProps.filter;
    onProps(props => {
      if (props && !props.focused && props.filter !== prevFilter) {
        setState({
          text: printFilter(props.filter, root.rgo.schema[props.type]),
        });
      }
    });
    const methods = methodWrap();
    return ({ path, ...props }, { text }) => {
      const invalid = text && !prevFilter;
      return {
        ...props,
        text,
        invalid,
        ...methods({
          setText: text => {
            prevFilter = parseFilter(text, props.type);
            setState({ text });
          },
          onMouseMove: () => props.setActive({ type: 'filter', path }),
          onMouseLeave: () => props.setActive(null),
          onClick: () => {
            props.setActive({ type: 'filter', path }, true);
            inputElem && inputElem.focus();
          },
          onClickOutside: e => {
            if (props.focused) {
              e.stopPropagation();
              if (!invalid) {
                props.updateFilter(path, prevFilter);
                props.setActive(null, true);
              }
            }
          },
          onKeyDown: event => {
            if (props.focused && event.keyCode === 13 && !invalid) {
              props.updateFilter(path, prevFilter);
              props.setActive(null, true);
              (document.activeElement as HTMLElement).blur();
            }
          },
        }),
        setInputElem,
      };
    };
  },
  props => ({ text: printFilter(props.filter, root.rgo.schema[props.type]) }),
)(
  ({
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
    <div
      onKeyDown={onKeyDown}
      style={{ position: 'relative', margin: -5, zIndex: 25 }}
    >
      <Outside
        onClickOutside={onClickOutside}
        style={{ position: 'relative', zIndex: 14 }}
      >
        <Div
          style={{
            layout: 'bar',
            background: focused
              ? invalid ? colors.red : colors.blue
              : active && 'rgba(0,0,0,0.1)',
            minWidth: 50,
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
      </Outside>
      {!focused && (
        <div
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 14,
            cursor: 'pointer',
          }}
        />
      )}
    </div>
  ),
);
