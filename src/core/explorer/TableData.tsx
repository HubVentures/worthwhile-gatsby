import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { compose, context, enclose, isolate } from 'mishmash';
import * as d3 from 'd3-selection';
import { root } from 'common';
import { getValueString } from 'common-client';
import { Input } from 'elmnt';

import { colors } from '../styles';

import inputStyle from './inputStyle';

const Editable = ({ value, onChange, inputRef, onBlur }) => (
  <div>
    <Input
      type="string"
      value={value}
      onChange={onChange}
      style={{ ...inputStyle, margin: -1 }}
      spellCheck={false}
      rows={0}
    />
    <Input
      type="string"
      value={value}
      onChange={onChange}
      style={{
        ...inputStyle,
        position: 'absolute',
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
      }}
      spellCheck={false}
      rows={0}
      onBlur={onBlur}
      ref={inputRef}
    />
  </div>
);

export default compose(
  context('store'),
  enclose(({ initialProps, setState }) => {
    initialProps.store.listen('editing', (editing = {}) =>
      setState({ editing }),
    );
    initialProps.store.listen('initial', (initial = {}) =>
      setState({ initial }),
    );
    const startEditing = (key, value) => {
      initialProps.store.set('editing', { key, value });
      initialProps.store.update('initial', (initial = {}) => ({
        ...initial,
        ...(initial[key] === undefined ? { [key]: value } : {}),
      }));
    };
    const stopEditing = () => {
      const { key, value } = initialProps.store.get('editing');
      root.rgo.set({ key: key.split('.'), value });
      initialProps.store.set('editing', {});
      initialProps.store.update('initial', ({ [key]: v, ...initial }) => {
        if (v === value) return initial;
        return { ...initial, [key]: v };
      });
    };
    const onChange = value =>
      initialProps.store.update('editing', v => ({ ...v, value }));
    return (props, state) => ({
      ...props,
      ...state,
      startEditing,
      stopEditing,
      onChange,
    });
  }),
)(
  isolate((elem, onUpdate) => {
    let inputRef = null;
    elem.style.borderTop = '1px solid #ccc';
    onUpdate(props => {
      if (props) {
        const rows = d3
          .select(elem)
          .selectAll('tr')
          .data([...props.dataRows]);

        rows
          .exit()
          .selectAll('td')
          .each(function() {
            ReactDOM.unmountComponentAtNode(this);
          });
        rows.exit().remove();

        const allRows = rows
          .enter()
          .append('tr')
          .merge(rows);

        const cells = allRows.selectAll('td').data(d => d);

        cells
          .exit()
          .each(function() {
            ReactDOM.unmountComponentAtNode(this);
          })
          .remove();

        const allCells = cells
          .enter()
          .append('td')
          .style('position', 'relative')
          .style('border-style', 'solid')
          .style('border-color', '#ccc')
          .style('vertical-align', 'top')
          .style('max-width', '400px')
          .style('font-family', 'Ubuntu, sans-serif')
          .style('font-size', '12px')
          .style('line-height', '18px')
          .style('white-space', 'pre-wrap')

          .merge(cells)
          .style('font-style', 'normal')
          .style('font-weight', 'normal')
          .style('padding', '7px 10px')
          .style('border-top-width', d => (!d.first ? '1px' : null))
          .style(
            'border-left-width',
            d => (!d.firstCol && (d.field === '#1' ? '2px' : '1px')) || null,
          )
          .style(
            'border-right-width',
            d => (!d.lastCol && d.field === '#2' && '1px') || null,
          )
          .style('background', d => (d.empty ? '#fafafa' : 'white'))
          .style(
            'color',
            d =>
              d.field.startsWith('#') || d.value === '-'
                ? '#ccc'
                : colors.black,
          )
          .attr('rowspan', d => d.span)
          .datum(d => ({
            type: d.type,
            field: d.field,
            key:
              d.value && !d.field.startsWith('#')
                ? `${d.type}.${d.id}.${d.field}`
                : null,
            value: d.value,
            text: d.text,
          }));

        allCells
          .filter(({ key }) => key)
          .style('cursor', 'pointer')
          .on('mouseenter', function() {
            this.style.background = '#eee';
          })
          .on('mouseleave', function() {
            this.style.background = 'white';
          })
          .on('dblclick', function({ key, value }) {
            props.startEditing(key, value);
            inputRef = this;
          })
          .each(function({ type, field, key, text }) {
            if (inputRef === this) {
              this.style.padding = null;
              ReactDOM.render(
                <Editable
                  value={props.editing.value}
                  onChange={props.onChange}
                  onBlur={() => {
                    props.stopEditing();
                    if (inputRef === this) inputRef = null;
                  }}
                  inputRef={elem => {
                    if (elem && inputRef === this) elem.focus();
                  }}
                />,
                this,
              );
            } else {
              ReactDOM.unmountComponentAtNode(this);
              if (props.editing.key === key) {
                this.textContent = getValueString(
                  props.editing.value,
                  (root.rgo.schema[type][field] as any).scalar,
                );
              } else {
                this.textContent = text;
              }
            }
          });

        allCells
          .filter(function(d) {
            return (
              inputRef !== this && Object.keys(props.initial).includes(d.key)
            );
          })
          .style('color', colors.blue)
          .style('background', '#f4fbff')
          .style('font-style', 'italic')
          .style('font-weight', 'bold');

        allCells
          .filter(({ key }) => !key)
          .style('cursor', null)
          .on('mouseenter', null)
          .on('mouseleave', null)
          .on('click', null)
          .each(function({ text }) {
            ReactDOM.unmountComponentAtNode(this);
            this.textContent = text;
          });
      } else {
        d3
          .select(elem)
          .selectAll('tr')
          .selectAll('td')
          .each(function() {
            ReactDOM.unmountComponentAtNode(this);
          });
      }
    });
  }, 'tbody'),
);
