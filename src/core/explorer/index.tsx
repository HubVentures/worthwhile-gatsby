import * as React from 'react';
import { Txt } from 'elmnt';
import { branch, compose, enclose, render } from 'mishmash';
import { Spinner } from 'common-client';
import { root } from 'common';
import { fieldIs } from 'rgo';

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
      let query = initialQuery;
      const updateFilter = (path, filter) => {
        const splitPath = path.split('.');
        const f = splitPath.reduce((res, i) => res.fields[i], {
          fields: query,
        });
        f.filter = filter;
        setState({
          fieldRows: fieldToRows({ fields: query }),
          dataRows: dataToRows(query, data),
        });
      };
      const clickSort = path => {
        const splitPath = path.split('.');
        const index = splitPath[splitPath.length - 1];
        const parent = splitPath
          .slice(0, -1)
          .reduce((res, i) => res.fields[i], { fields: query });
        const f = parent.fields[index];
        const ascIndex = (parent.sort || []).indexOf(f);
        const descIndex = (parent.sort || []).indexOf(`-${f}`);
        if (ascIndex !== -1) {
          parent.sort[ascIndex] = `-${f}`;
        } else if (descIndex !== -1) {
          parent.sort.splice(descIndex, 1);
          if (parent.sort.length === 0) delete parent.sort;
        } else if (!parent.sort) {
          parent.sort = [f];
        } else {
          let i = 0;
          while (i !== -1) {
            const s = parent.sort[i];
            if (
              i === parent.sort.length ||
              parent.fields.indexOf(s[0] === '-' ? s.slice(1) : s) > index
            ) {
              parent.sort.splice(i, 0, f);
              i = -1;
            } else {
              i++;
            }
          }
        }
        setState({
          fieldRows: fieldToRows({ fields: query }),
          dataRows: dataToRows(query, data),
        });
      };
      const updatePaging = (path, start, end) => {
        const splitPath = path.split('.');
        const f = splitPath.reduce((res, i) => res.fields[i], {
          fields: query,
        });
        f.start = start - 1;
        f.end = end && end - 1;
        if (!f.end) delete f.end;
        setState({
          fieldRows: fieldToRows({ fields: query }),
          dataRows: dataToRows(query, data),
        });
      };
      const clickAdd = (path, type, field) => {
        const splitPath = path.split('.');
        const index = splitPath[splitPath.length - 1];
        const parent = splitPath
          .slice(0, -1)
          .reduce((res, i) => res.fields[i], { fields: query });
        parent.fields.splice(
          index,
          0,
          type && fieldIs.scalar(root.rgo.schema[type][field])
            ? field
            : { name: field, fields: [] },
        );
        setState({
          fieldRows: fieldToRows({ fields: query }),
          dataRows: dataToRows(query, data),
        });
      };
      const clickRemove = path => {
        const splitPath = path.split('.');
        const index = splitPath[splitPath.length - 1];
        const parent = splitPath
          .slice(0, -1)
          .reduce((res, i) => res.fields[i], { fields: query });
        parent.fields.splice(index, 1);
        setState({
          fieldRows: fieldToRows({ fields: query }),
          dataRows: dataToRows(query, data),
        });
      };
      return (props, state) => ({
        ...props,
        ...state,
        updateFilter,
        clickSort,
        updatePaging,
        clickAdd,
        clickRemove,
      });
    },
    () => ({
      fieldRows: fieldToRows({ fields: initialQuery }),
      dataRows: dataToRows(initialQuery, data),
    }),
  ),
  enclose(
    ({ setState }) => {
      const setActive = (active, focus = false) =>
        setState(({ activeFocus }) => {
          if (activeFocus && !focus) return;
          return {
            activeFocus: (active && focus) || false,
            activeType: active && active.type,
            activePath: active && active.path,
          };
        });
      return (props, state) => ({ ...props, ...state, setActive });
    },
    {
      activeFocus: false,
      activeType: null as null | string,
      activePath: null as null | string,
    },
  ),
)(
  ({
    fieldRows,
    dataRows,
    updateFilter,
    clickSort,
    updatePaging,
    clickAdd,
    clickRemove,
    activeFocus,
    activeType,
    activePath,
    setActive,
  }) => (
    <table style={{ margin: '50px' }}>
      <thead style={{ borderRight: '1px solid #ccc' }}>
        {fieldRows.map((row, i, rows) => (
          <tr key={i}>
            {row.map((d, j) => (
              <HeaderCell
                {...d}
                rowSpan={d.span ? 1 : rows.length - i}
                alt={
                  (d.path.split('.').length + (name === '#2' ? 1 : 0)) % 2 === 0
                }
                updateFilter={updateFilter}
                clickSort={clickSort}
                updatePaging={updatePaging}
                clickAdd={clickAdd}
                clickRemove={clickRemove}
                focused={activeFocus}
                isPathAdd={activeType === 'add' && activePath === d.path}
                isLastPathAdd={activeType === 'add' && activePath === d.last}
                isPathSort={activeType === 'sort' && activePath === d.path}
                isSiblingSort={
                  activeType === 'sort' &&
                  parent(activePath) === parent(d.path, d.name === '#2' ? 2 : 1)
                }
                isPathRemove={activeType === 'remove' && activePath === d.path}
                isPathPaging={activeType === 'paging' && activePath === d.path}
                isPathFilter={activeType === 'filter' && activePath === d.path}
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
                  // ...(d.field.startsWith('#') ? { padding: 7 } : {}),
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
                      ...(d.value === undefined ||
                      d.value === null ||
                      d.field.startsWith('#')
                        ? { color: '#ccc' }
                        : {}),
                    }}
                  >
                    {d.value === undefined || d.value === null
                      ? '-'
                      : `${d.value}`}
                  </Txt>
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
);
