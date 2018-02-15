import * as React from 'react';
import { enclose } from 'mishmash';

import { colors } from '../styles';

import { HeaderCell } from './HeaderCell';

const parent = (path, depth = 1) =>
  path &&
  path
    .split('.')
    .slice(0, -depth)
    .join('.');

export default enclose(
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
    return (props, state) => ({
      ...props,
      ...state,
      setActive,
    });
  },
  {
    activeFocus: false,
    activeType: null as null | string,
    activePath: null as null | string,
  },
)(
  ({
    types,
    fieldRows,
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
    <table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
      <thead>
        {fieldRows.map((row, i) => (
          <tr key={i}>
            {row.map(d => (
              <HeaderCell
                types={types}
                {...d}
                rowSpan={d.span ? 1 : fieldRows.length - i}
                alt={
                  (d.path.split('.').length + (d.name === '#2' ? 1 : 0)) % 2 ===
                  0
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
                isChildRemove={
                  activeType === 'remove' && d.path.startsWith(activePath)
                }
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
                key={`${d.path}_${d.name}`}
              />
            ))}
          </tr>
        ))}
      </thead>
    </table>
  ),
);
