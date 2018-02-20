import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { compose, context, enclose, isolate } from 'mishmash';
import * as d3 from 'd3-selection';
import { root } from 'common';
import { getValueString } from 'common-client';
import { Input } from 'elmnt';

import { colors } from '../styles';

import inputStyle from './inputStyle';

const Editable = enclose(({ initialProps, onProps, setState }) => {
  initialProps.store.watch(
    'editing',
    (editing = {}) => setState({ editing }),
    onProps,
  );
  const onChange = value =>
    initialProps.store.update('editing', v => ({ ...v, value }));
  let lastValue = initialProps.store.get('editing').value;
  return (props, { editing }) => ({
    ...props,
    value:
      Object.keys(editing).length > 0 ? (lastValue = editing.value) : lastValue,
    onChange,
  });
})(({ value, onChange, inputRef, onBlur }) => (
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
));

export default compose(
  context('store'),
  enclose(({ initialProps, onProps, setState }) => {
    initialProps.store.watch(
      'editing',
      (editing = {}) => setState({ editing }),
      onProps,
    );
    initialProps.store.watch(
      'initial',
      (initial = {}) => setState({ initial }),
      onProps,
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
      initialProps.store.set('editing', {});
      initialProps.store.update('initial', ({ [key]: v, ...initial }) => {
        if (v === value) {
          root.rgo.set({ key: key.split('.'), value: undefined });
          return initial;
        }
        root.rgo.set({ key: key.split('.'), value });
        return { ...initial, [key]: v };
      });
    };
    return (props, state) => ({
      ...props,
      ...state,
      startEditing,
      stopEditing,
      updateWidths: props.store.updateWidths,
    });
  }),
)(
  isolate((elem, onProps) => {
    let inputRef = null;
    elem.style.borderTop = '1px solid #ccc';
    onProps(props => {
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
          .on('mouseleave', function(d) {
            this.style.background =
              inputRef !== this && Object.keys(props.initial).includes(d.key)
                ? '#f4fbff'
                : 'white';
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
                  store={props.store}
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

      props.updateWidths();
    });
  }, 'tbody'),
);
