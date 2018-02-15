import * as React from 'react';
import { compose, map, pure, withSize } from 'mishmash';
import { Txt } from 'elmnt';

import { colors } from '../styles';

import Header from './Header';
import { ShadowHeaderCell } from './HeaderCell';
import { dataToRows, fieldToRows } from './mapping';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: colors.black,
};

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
    size,
    setSizeElem,
  }) => (
    <div
      style={{
        position: 'relative',
        height: size.height && size.height + 2,
        maxHeight: '100%',
        width: size.width && size.width + 4,
        maxWidth: '100%',
        overflow: 'scroll',
        borderLeft: '2px solid #ccc',
        borderRight: '2px solid #ccc',
        borderBottom: '2px solid #ccc',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: size.width,
          height: '100%',
        }}
      >
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
        <div
          style={{
            height: '100%',
            overflow: 'hidden',
            width: size.width,
          }}
        >
          <div
            style={{
              height: '100%',
              width: 100000,
              paddingRight: 50,
              marginRight: -50,
              overflow: 'scroll',
            }}
          >
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
                      <ShadowHeaderCell
                        types={types}
                        {...d}
                        rowSpan={d.span ? 1 : fieldRows.length - i}
                        key={`${d.path}_${d.name}`}
                      />
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody style={{ borderTop: '1px solid #ccc' }}>
                {dataRows.map((row, i) => (
                  <tr key={i}>
                    {row.map((d, j) => (
                      <td
                        style={{
                          padding: 10,
                          borderTopWidth: !d.first && 1,
                          borderLeftWidth:
                            !d.firstCol && (d.field === '#1' ? 2 : 1),
                          borderRightWidth: !d.lastCol && d.field === '#2' && 1,
                          borderStyle: 'solid',
                          borderColor: '#ccc',
                          position: 'relative',
                          verticalAlign: 'top',
                          maxWidth: 400,
                          background: d.empty ? '#fafafa' : 'white',
                        }}
                        rowSpan={d.span || 1}
                        key={j}
                      >
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
                          {d.value === undefined
                            ? ''
                            : d.value === null ? '-' : `${d.value}`}
                        </Txt>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
