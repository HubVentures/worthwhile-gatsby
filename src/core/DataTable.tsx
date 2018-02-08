import * as React from 'react';
import { Div, Icon, Txt } from 'elmnt';
import {
  branch,
  compose,
  enclose,
  fitScreen,
  render,
  renderLifted,
  withHover,
} from 'mishmash';
import { root } from 'common';
import { Spinner } from 'common-client';

import { colors, icons } from './styles';

const initialQuery = [
  {
    name: 'ww_people',
    fields: [
      'firstname',
      'lastname',
      {
        name: 'equalopps',
        alias: 'test',
        fields: [
          'gender',
          { name: 'person', fields: ['firstname', 'lastname'] },
          'disability',
        ],
      },
      {
        name: 'equalopps',
        fields: ['gender'],
      },
      'email',
    ],
  },
];
const data = {
  ww_people: [
    {
      firstname: 'Dave',
      lastname: 'Smith',
      test: [
        {
          gender: 'Male',
          person: { firstname: 'Dave', lastname: 'Smith' },
          disability: false,
        },
        {
          gender: 'Male',
          person: { firstname: 'Dave', lastname: 'Smith' },
          disability: true,
        },
      ],
      equalopps: [{ gender: 'Male' }, { gender: 'Male' }, { gender: 'Male' }],
      email: 'dave.smith@gmail.com',
    },
    null,
    {
      firstname: 'Susan',
      lastname: 'Jones',
      test: [
        {
          gender: 'Female',
          person: { firstname: 'Susan', lastname: 'Jones' },
          disability: false,
        },
      ],
      equalopps: [],
      email: 'susan.jones@gmail.com',
    },
  ],
};

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 13,
  color: colors.black,
};

const fieldsToRows = (fields, type = null as 'string' | null) =>
  fields.reduce(
    (rows, f) => {
      if (typeof f === 'string') {
        rows[0].push({ name: f, type });
        return rows;
      }
      const newType = type
        ? (root.rgo.schema[type][f.name] as any).type
        : f.name;
      const newRows = fieldsToRows(f.fields, newType);
      rows[0].push({
        name: f.name,
        type,
        span: newRows[0].reduce((res, g) => res + (g.span || 1), 2),
      });
      (rows[1] || (rows[1] = [])).push({ name: '#', type });
      newRows.forEach((r, i) => {
        rows[i + 1] = [...(rows[i + 1] || []), ...r];
      });
      rows[1].push({ name: '#', type });
      return rows;
    },
    [[]],
  );

const dataToRows = (fields, data) => {
  const dataArray = Array.isArray(data) ? data : [data];
  if (dataArray.length === 0) dataArray.push(null);
  const x = dataArray.reduce((result, values, i) => {
    const dataBlocks = fields.map(
      f => {
        if (typeof f === 'string') {
          return [
            [
              {
                field: f,
                value: f === '#' ? i + 1 : values && values[f],
                span: 1,
              },
            ],
          ];
        }
        return dataToRows(
          ['#', ...f.fields, '#'],
          values && values[f.alias || f.name],
        );
      },
      [[]],
    );
    const height = Math.max(...dataBlocks.map(rows => rows.length));
    return [
      ...result,
      ...dataBlocks.reduce((res, rows) => {
        let blockHeight = 0;
        rows.forEach((row, j) => {
          res[j] = [
            ...(res[j] || []),
            ...row.map(v => ({
              ...v,
              ...(j === rows.length - 1 ? { span: height - blockHeight } : {}),
            })),
          ];
          blockHeight += row[0].span;
        });
        return res;
      }, []),
    ];
  }, []);
  return x;
};

console.log(JSON.stringify(dataToRows(initialQuery, data), null, 2));

const AddField = compose(
  enclose(
    ({ setState }) => {
      const setOpen = () => setState({ isOpen: true });
      const setClosed = () => setState({ isOpen: false });
      return (props, { isOpen }) => ({ ...props, isOpen, setOpen, setClosed });
    },
    { isOpen: false },
  ),
  renderLifted(
    fitScreen(({ liftBounds: { top, left } }) => ({
      base: { top: top + 26, left: left - 87, width: 200 },
      gap: 4,
    }))(({ type, setClosed, setInnerElem, fitStyle, fitSmall }) => (
      <div>
        <div
          onClick={setClosed}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: fitSmall ? 'rgba(0,0,0,0.5)' : 'none',
          }}
        />
        <div
          style={{
            ...fitStyle,
            boxShadow: fitSmall
              ? '0 2px 25px rgba(0,0,0,0.5)'
              : '0 2px 20px 5px rgba(0,0,0,0.4)',
          }}
        >
          <div ref={setInnerElem}>
            <Div style={{ spacing: 8, padding: 8, background: 'white' }}>
              {Object.keys(window.rgo.schema[type])
                .sort()
                .map((f, i) => (
                  <Txt style={textStyle} key={i}>
                    {f}
                  </Txt>
                ))}
            </Div>
          </div>
        </div>
      </div>
    )),
    ({ isOpen }) => isOpen,
  ),
  withHover,
)(({ isOpen, setOpen, setLiftBaseElem, isHovered, hoverProps }) => (
  <div
    onClick={setOpen}
    {...hoverProps}
    style={{
      position: 'absolute',
      top: 0,
      left: -13,
      padding: 5,
      cursor: 'pointer',
    }}
    ref={setLiftBaseElem}
  >
    <Icon
      {...icons.plus}
      style={{
        fontSize: 9,
        background: 'white',
        padding: 3,
        visibility: isHovered || isOpen || true ? 'visible' : 'hidden',
      }}
    />
  </div>
));

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
      return (props, { query }) => ({ ...props, query, setQuery });
    },
    { query: initialQuery },
  ),
)(({ query }) => (
  <table style={{ margin: '0 50px' }}>
    <tbody>
      {fieldsToRows(query).map((row, i, rows) => (
        <tr key={i}>
          {row.map((d, j) => (
            <td
              style={{
                padding: '6px 16px',
                position: 'relative',
                verticalAlign: 'bottom',
                borderLeft: '1px solid #e5e5e5',
                borderRight: '1px solid #e5e5e5',
                background: d.span || d.name === '#' ? '#eee' : '#f6f6f6',
                ...(d.name === '#' ? { padding: '6px 6px' } : {}),
              }}
              colSpan={d.span || 1}
              rowSpan={d.span ? 1 : rows.length - i}
              key={j}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderTop: d.name !== '#' && '1px solid #e5e5e5',
                }}
              />
              {(d || row[j - 1]) &&
                false && <AddField type={(d || row[j - 1]).type} />}
              {
                <Txt
                  style={{
                    ...textStyle,
                    fontWeight: 'bold',
                    color: d.span ? '#666' : colors.black,
                    cursor: 'default',
                  }}
                >
                  {d.name === '#' ? null : d.name}
                </Txt>
              }
            </td>
          ))}
        </tr>
      ))}
      {dataToRows(query, data).map((row, i) => (
        <tr key={i}>
          {row.map((d, j) => (
            <td
              style={{
                padding: '6px 16px',
                border: '1px solid #e5e5e5',
                position: 'relative',
                ...(d.field === '#' ? { padding: '6px 6px' } : {}),
                verticalAlign: 'top',
              }}
              rowSpan={d.span}
              key={j}
            >
              {
                <Txt
                  style={{
                    ...textStyle,
                    ...(d.field === '#' ? { color: '#bbb' } : {}),
                    cursor: 'default',
                  }}
                >
                  {d.value === null ? '-' : `${d.value}`}
                </Txt>
              }
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
));
