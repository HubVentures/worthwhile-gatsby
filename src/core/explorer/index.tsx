import * as React from 'react';
import { Txt } from 'elmnt';
import { branch, compose, enclose, render } from 'mishmash';
import { Spinner } from 'common-client';

import { colors } from '../styles';

import HeaderCell from './HeaderCell';
import { dataToRows, fieldToRows } from './mapping';

import { data, initialQuery } from './test';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: colors.black,
};

const parent = (path, depth = 1) =>
  path &&
  path
    .split('.')
    .slice(0, -depth)
    .join('.');

export default compose(
  enclose(
    ({ setState }) => {
      window.rgo.query().then(() => setState({ loading: false }));
      return (props, { loading }) => ({ ...props, loading });
    },
    { loading: true },
  ),
  branch(
    ({ loading }) => loading,
    render(() => <Spinner style={{ color: colors.blue }} />),
  ),
  enclose(
    ({ setState }) => {
      const setQuery = query => setState({ query });
      return (props, { query }) => ({
        ...props,
        fieldRows: fieldToRows({ fields: query }),
        dataRows: dataToRows(query, data),
        setQuery,
      });
    },
    { query: initialQuery },
  ),
  enclose(
    ({ setState }) => {
      const setActive = active =>
        setState({
          activeType: active && active.type,
          activePath: active && active.path,
        });
      return (props, state) => ({ ...props, ...state, setActive });
    },
    { activeType: null as null | string, activePath: null as null | string },
  ),
)(({ fieldRows, dataRows, activeType, activePath, setActive }) => (
  <table style={{ margin: '50px' }}>
    <thead style={{ borderRight: '1px solid #ccc' }}>
      {fieldRows.map((row, i, rows) => (
        <tr key={i}>
          {row.map((d, j) => (
            <HeaderCell
              {...d}
              i={i}
              j={j}
              rows={rows}
              row={row}
              alt={
                (d.path.split('.').length + (name === '#2' ? 1 : 0)) % 2 === 0
              }
              isPathAdd={activeType === 'add' && activePath === d.path}
              isLastPathAdd={activeType === 'add' && activePath === d.last}
              isPathSort={activeType === 'sort' && activePath === d.path}
              isSiblingSort={
                activeType === 'sort' &&
                parent(activePath) === parent(d.path, d.name === '#2' ? 2 : 1)
              }
              isPathRemove={activeType === 'remove' && activePath === d.path}
              setActive={setActive}
              color={
                activeType === 'remove' &&
                (activePath === d.path || d.path.startsWith(activePath))
                  ? colors.red
                  : activeType === 'sort' &&
                    (activePath === d.path || activePath === parent(d.path))
                    ? colors.blue
                    : colors.black
              }
              key={j}
            />
          ))}
        </tr>
      ))}
    </thead>
    <tbody
      style={{ borderTop: '1px solid #ccc', borderBottom: '2px solid #ccc' }}
    >
      {dataRows.map((row, i) => (
        <tr key={i}>
          {row.map((d, j) => (
            <td
              style={{
                padding: '7px 10px',
                position: 'relative',
                ...(d.field.startsWith('#') ? { padding: 7 } : {}),
                verticalAlign: 'top',
              }}
              rowSpan={d.span}
              key={j}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: -1,
                  bottom: -1,
                  borderTop: '1px solid #ccc',
                  borderRight:
                    d.field === '#2' ? '2px solid #ccc' : '1px solid #ccc',
                  borderBottom: '1px solid #ccc',
                  borderLeft:
                    d.field === '#1' ? '2px solid #ccc' : '1px solid #ccc',
                }}
              />
              {
                <Txt
                  style={{
                    ...textStyle,
                    ...(d.value === null || d.field.startsWith('#')
                      ? { color: '#ccc' }
                      : {}),
                  }}
                >
                  {d.value === undefined
                    ? ''
                    : d.value === null ? '-' : `${d.value}`}
                </Txt>
              }
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
));
