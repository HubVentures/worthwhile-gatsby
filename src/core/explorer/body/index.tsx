import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { compose, enclose, isolate, map, restyle } from 'mishmash';
import { root } from 'common';
import { css } from 'elmnt';

import { colors } from '../../styles';

import d3 from './d3';
import dataToRows from './dataToRows';
import Input from './Input';

export default compose(
  map(
    restyle({
      base: [
        ['mergeKeys', 'data'],
        ['defaults', { fontStyle: 'normal', fontWeight: 'normal' }],
        [
          'scale',
          {
            paddingTop: { paddingTop: 1, fontSize: 0.5, lineHeight: -0.5 },
            paddingBottom: {
              paddingBottom: 1,
              fontSize: 0.5,
              lineHeight: -0.5,
            },
          },
        ],
        [
          'filter',
          ...css.groups.text,
          'padding',
          'border',
          'background',
          'maxWidth',
        ],
        [
          'merge',
          {
            position: 'relative',
            verticalAlign: 'top',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
        ],
      ],
      input: [
        ['mergeKeys', 'data', 'input'],
        ['scale', { maxWidth: { maxWidth: 1, borderLeftWidth: 1 } }],
        ['merge', { position: 'relative', zIndex: 200 }],
      ],
    }),
    restyle({
      base: {
        null: [['mergeKeys', 'null']],
        empty: [['mergeKeys', 'empty']],
        changed: [['mergeKeys', 'changed']],
      },
    }),
  ),
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
    return ({ context, query, data, style }, state) => ({
      context,
      dataRows: dataToRows(context, query, data),
      startEditing,
      stopEditing,
      ...state,
      style,
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
          .merge(cells)
          .datum(d => ({
            ...d,
            style:
              inputRef !== this && Object.keys(props.initial).includes(d.key)
                ? 'changed'
                : d.empty
                  ? 'empty'
                  : d.field.startsWith('#') || d.value === '-'
                    ? 'null'
                    : 'base',
          }))
          .style(d => props.style[d.style])
          .style(d => ({
            borderTopWidth:
              (!d.first ? 1 : 0) * props.style.base.borderTopWidth,
            borderBottomWidth: 0,
            borderLeftWidth:
              ((!d.firstCol && (d.field === '#1' ? 2 : 1)) || 0) *
              props.style.base.borderLeftWidth,
            borderRightWidth:
              ((!d.lastCol && d.field === '#2' && 1) || 0) *
              props.style.base.borderRightWidth,
          }))
          .attr('rowspan', d => d.span);

        allCells
          .filter(({ key }) => key)
          .style({ cursor: 'pointer' })
          .on('mouseenter', function(d) {
            const s = props.style[d.style];
            this.style.background =
              (s.hover && s.hover.background) || s.background;
          })
          .on('mouseleave', function(d) {
            this.style.background = props.style[d.style].background;
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
                  style={props.style.input}
                />,
                this,
              );
            } else {
              ReactDOM.unmountComponentAtNode(this);
              if (props.editing.key === key) {
                this.textContent = props.context.config.printValue(
                  props.editing.value,
                  (root.rgo.schema[type][field] as any).scalar,
                );
              } else {
                this.textContent = text;
              }
            }
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
