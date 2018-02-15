import * as React from 'react';
import { compose, map, pure, withSize } from 'mishmash';

import TableData from './TableData';
import Header from './Header';
import HeaderCell from './HeaderCell';
import { dataToRows, fieldToRows } from './mapping';

const DataTable = pure(
  ({ types, fieldRows, dataRows, fetching, setSizeElem }) => (
    <table
      style={{
        borderCollapse: 'separate',
        borderSpacing: 0,
        tableLayout: 'fixed',
      }}
      ref={setSizeElem}
    >
      <thead>
        {fieldRows.map((row, i) => (
          <tr key={i}>
            {row.map(d => (
              <HeaderCell
                types={types}
                {...d}
                rowSpan={d.span ? 1 : fieldRows.length - i}
                fetching={fetching}
                key={`${d.path}_${d.name}`}
              />
            ))}
          </tr>
        ))}
      </thead>
      <TableData dataRows={dataRows} />
    </table>
  ),
);

export default compose(
  pure,
  map(({ index, query, data, ...props }) => ({
    ...props,
    fieldRows: fieldToRows({ fields: query }, null, '', index),
    dataRows: dataToRows(query, data),
  })),
  withSize('size', 'setSizeElem'),
)(
  ({
    types,
    fieldRows,
    dataRows,
    fetching,
    updateFilter,
    clickSort,
    updatePaging,
    clickAdd,
    clickRemove,
    size: { width = 0, height = 0 } = {},
    setSizeElem,
  }) => (
    <div
      style={{
        position: 'relative',
        height: height + 2,
        maxHeight: '100%',
        width: width && width + 4,
        maxWidth: '100%',
        overflow: 'scroll',
        ...(width
          ? {
              borderLeft: '2px solid #ccc',
              borderRight: '2px solid #ccc',
              borderBottom: '2px solid #ccc',
            }
          : {}),
      }}
    >
      <div style={{ position: 'relative', width, height: '100%' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: 100000 }}>
            <Header
              types={types}
              fieldRows={fieldRows}
              updateFilter={updateFilter}
              clickSort={clickSort}
              updatePaging={updatePaging}
              clickAdd={clickAdd}
              clickRemove={clickRemove}
            />
          </div>
        </div>
        <div style={{ height: '100%', overflow: 'hidden', width }}>
          <div
            style={{
              height: '100%',
              width: 100000,
              paddingRight: 50,
              marginRight: -50,
              overflow: 'scroll',
            }}
          >
            <DataTable
              types={types}
              fieldRows={fieldRows}
              dataRows={dataRows}
              fetching={fetching}
              setSizeElem={setSizeElem}
            />
            {fetching && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  background: 'rgba(255,255,255,0.9)',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  ),
);
