import * as React from 'react';
import { Txt } from 'elmnt';
import { compose, pure, withSize } from 'mishmash';

import { colors } from '../styles';

import { ShadowHeaderCell } from './HeaderCell';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: colors.black,
};

export default compose(
  pure,
  withSize((props, size) => props.setSize(size), 'setSizeElem'),
)(({ types, fieldRows, dataRows, setSizeElem }) => (
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
                borderLeftWidth: !d.firstCol && (d.field === '#1' ? 2 : 1),
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
));
