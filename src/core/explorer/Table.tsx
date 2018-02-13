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
)(({ fieldRows, dataRows, setSizeElem }) => (
  <table style={{ tableLayout: 'fixed', overflow: 'hidden' }} ref={setSizeElem}>
    <thead>
      {fieldRows.map((row, i) => (
        <tr key={i}>
          {row.map(d => (
            <ShadowHeaderCell
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
                ...(d.noLeft ? { paddingLeft: 8 } : {}),
                ...(d.noRight ? { paddingRight: 9 } : {}),
                position: 'relative',
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
                  bottom: !d.last ? -1 : 0,
                  borderTop: '1px solid #ccc',
                  borderRight:
                    !d.noRight &&
                    (d.field === '#2' ? '2px solid #ccc' : '1px solid #ccc'),
                  borderBottom: !d.last && '1px solid #ccc',
                  borderLeft:
                    !d.noLeft &&
                    (d.field === '#1' ? '2px solid #ccc' : '1px solid #ccc'),
                }}
              />
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
                {d.value === undefined || d.value === null ? '-' : `${d.value}`}
              </Txt>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
));
