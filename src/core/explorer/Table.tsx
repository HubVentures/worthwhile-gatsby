import * as React from 'react';
import { compose, map, pure, withSize, Wrap } from 'mishmash';

import TableData from './TableData';
import Header from './Header';
import HeaderCell from './HeaderCell';
import { dataToRows, fieldToRows } from './mapping';

const DataTable = pure(({ types, fieldRows, dataRows, fetching }) => (
  <table
    style={{
      borderCollapse: 'separate',
      borderSpacing: 0,
      tableLayout: 'fixed',
    }}
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
));

export default compose(
  pure,
  map(({ index, query, data, ...props }) => ({
    ...props,
    fieldRows: fieldToRows({ fields: query }, null, '', index),
    dataRows: dataToRows(query, data),
  })),
  withSize('height', 'setHeightElem', ({ height = 0 }) => height),
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
    height,
    setHeightElem,
  }) => (
    <div
      style={{
        position: 'relative',
        height: height + 2,
        maxHeight: '100%',
        borderLeft: '2px solid #ccc',
        borderRight: '2px solid #ccc',
        borderBottom: '2px solid #ccc',
        visibility: height ? 'visible' : 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
          }}
        >
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
        <div style={{ height: '100%', paddingTop: fieldRows.length * 33 + 2 }}>
          <div style={{ height: '100%', overflow: 'scroll' }}>
            <div
              style={{
                height: '100%',
                marginTop: -(fieldRows.length * 33 + 2),
              }}
            >
              <div style={{ display: 'table' }} ref={setHeightElem}>
                <DataTable
                  types={types}
                  fieldRows={fieldRows}
                  dataRows={dataRows}
                  fetching={fetching}
                />
              </div>
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
    </div>
  ),
);
