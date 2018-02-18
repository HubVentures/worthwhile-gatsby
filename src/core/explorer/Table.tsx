import * as React from 'react';
import { compose, enclose, map, methodWrap, pure, withSize } from 'mishmash';

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
  map(({ query, data, ...props }) => ({
    ...props,
    fieldRows: fieldToRows({ fields: query }, null, '', props.index),
    dataRows: dataToRows(query, data),
  })),
  withSize('height', 'setHeightElem', ({ height = 0 }) => height),
  enclose(({ initialProps, onProps, setState }) => {
    let key;
    let unlisten;
    const update = props => {
      if (props) {
        const newKey = `${props.index}_table_width`;
        if (newKey !== key) {
          key = newKey;
          unlisten && unlisten();
          unlisten = props.store.listen(key, width => setState({ width }));
        }
      } else {
        unlisten();
      }
    };
    update(initialProps);
    onProps(update);

    const methods = methodWrap();
    return (props, state) => ({
      ...props,
      ...state,
      ...methods({
        setSizeElem: elem => {
          props.setHeightElem(elem);
          props.store.setWidthElem(`${props.index}_table_width`, elem);
        },
      }),
    });
  }),
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
    width,
    setSizeElem,
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
            width: 1000000,
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
        <div
          style={{
            height: '100%',
            paddingTop: fieldRows.length * 33 + 2,
            overflow: 'hidden',
          }}
        >
          <div style={{ height: '100%', overflow: 'scroll' }}>
            <div
              style={{
                height: '100%',
                marginTop: -(fieldRows.length * 33 + 2),
              }}
            >
              <div style={{ width, overflow: 'hidden' }}>
                <div style={{ width: 1000000 }}>
                  <div style={{ display: 'table' }} ref={setSizeElem}>
                    <DataTable
                      types={types}
                      fieldRows={fieldRows}
                      dataRows={dataRows}
                      fetching={fetching}
                    />
                  </div>
                </div>
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
