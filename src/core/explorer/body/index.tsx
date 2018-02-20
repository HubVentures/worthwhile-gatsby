import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { compose, enclose, isolate } from 'mishmash';
import { root } from 'common';
import { getValueString } from 'common-client';

import { colors } from '../../styles';

import d3 from './d3';
import dataToRows from './dataToRows';
import Input from './Input';

export default compose(
  enclose(({ initialProps, onProps, setState }) => {
    initialProps.context.store.watch(
      'editing',
      (editing = {}) => setState({ editing }),
      onProps,
    );
    initialProps.context.store.watch(
      'initial',
      (initial = {}) => setState({ initial }),
      onProps,
    );
    const startEditing = (key, value) => {
      initialProps.context.store.set('editing', { key, value });
      initialProps.context.store.update('initial', (initial = {}) => ({
        ...initial,
        ...(initial[key] === undefined ? { [key]: value } : {}),
      }));
    };
    const stopEditing = () => {
      const { key, value } = initialProps.context.store.get('editing');
      initialProps.context.store.set('editing', {});
      initialProps.context.store.update(
        'initial',
        ({ [key]: v, ...initial }) => {
          if (v === value) {
            root.rgo.set({ key: key.split('.'), value: undefined });
            return initial;
          }
          root.rgo.set({ key: key.split('.'), value });
          return { ...initial, [key]: v };
        },
      );
    };
    return ({ context, query, data }, state) => ({
      context,
      dataRows: dataToRows(query, data),
      startEditing,
      stopEditing,
      ...state,
    });
  }),
)(
  isolate((elem, onProps) => {
    let inputRef = null;
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
          .style({
            position: 'relative',
            borderStyle: 'solid',
            borderColor: '#ccc',
            verticalAlign: 'top',
            maxWidth: 400,
            fontFamily: 'Ubuntu, sans-serif',
            fontSize: 12,
            lineHeight: '18px',
            whiteSpace: 'pre-wrap',
          })

          .merge(cells)
          .style(d => ({
            fontStyle: 'normal',
            fontWeight: 'normal',
            padding: '7px 10px',
            borderTopWidth: !d.first ? 1 : null,
            borderLeftWidth:
              (!d.firstCol && (d.field === '#1' ? 2 : 1)) || null,
            borderRightWidth: (!d.lastCol && d.field === '#2' && 1) || null,
            background: d => (d.empty ? '#fafafa' : 'white'),
            color:
              d.field.startsWith('#') || d.value === '-'
                ? '#ccc'
                : colors.black,
          }))
          .attr('rowspan', d => d.span);

        allCells
          .filter(({ key }) => key)
          .style({ cursor: 'pointer' })
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
                <Input
                  store={props.context.store}
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
          .style({
            color: colors.blue,
            background: '#f4fbff',
            fontStyle: 'italic',
            fontWeight: 'bold',
          });

        allCells
          .filter(({ key }) => !key)
          .style({ cursor: null })
          .on('mouseenter', null)
          .on('mouseleave', null)
          .on('dblclick', null)
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

      props.context.updateWidths();
    });
  }, 'tbody'),
);
