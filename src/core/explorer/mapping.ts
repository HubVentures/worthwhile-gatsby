import { noUndef, root } from 'common';
import { getValueString } from 'common-client';

export const fieldToRows = (
  { sort = [] as any, fields },
  type,
  path,
  baseIndex = 0,
) =>
  fields.length === 0
    ? [[{ name: '', type, path: path ? `${path}.${0}` : `${baseIndex}` }]]
    : fields.reduce(
        (rows, f, i) => {
          const newPath = path ? `${path}.${i}` : `${baseIndex + i}`;
          const nextPath = path ? `${path}.${i + 1}` : `${baseIndex + i + 1}`;
          if (typeof f === 'string') {
            rows[0].push({
              name: f,
              type,
              isList: f !== 'id' && (root.rgo.schema[type!][f] as any).isList,
              path: newPath,
              sort: sort.includes(f)
                ? 'asc'
                : sort.includes(`-${f}`) ? 'desc' : null,
              last: i === fields.length - 1 && nextPath,
            });
            return rows;
          }
          const newType = type
            ? (root.rgo.schema[type][f.name] as any).type
            : f.name;
          const newRows = fieldToRows(f, newType, newPath);
          rows[0].push(
            {
              name: '#1',
              type: type,
              path: newPath,
              firstCol: i === 0 && !path,
            },
            {
              name: f.name,
              type: newType,
              path: newPath,
              span: newRows[0].reduce((res, g) => res + (g.span || 1), 0),
            },
            {
              name: '#2',
              type: type,
              path: `${newPath}.${
                newRows[0].filter(d => !d.name.startsWith('#')).length
              }`,
              last: i === fields.length - 1 && nextPath,
              lastCol: i === fields.length - 1 && !path,
            },
          );
          newRows.forEach((r, j) => {
            rows[j + 1] = [...(rows[j + 1] || []), ...r];
          });
          return rows;
        },
        [[]],
      );

export const dataToRows = (
  fields,
  data,
  type = null as null | string,
  start = 0,
  initial = true,
  first = true,
) => {
  const dataArray = Array.isArray(data) ? data : [data];
  if (dataArray.length === 0) dataArray.push(undefined);
  return dataArray.reduce((result, values, i) => {
    const dataBlocks = fields.map((f, j) => {
      if (typeof f === 'string') {
        return [
          [
            {
              type,
              id: values && values.id,
              field: f,
              value: noUndef(values && values[f]),
              text:
                f === '' || values === undefined
                  ? ''
                  : f.startsWith('#')
                    ? start + i + 1
                    : getValueString(
                        noUndef(values && values[f]),
                        f === 'id'
                          ? 'string'
                          : (root.rgo.schema[type!][f] as any).scalar,
                      ),
              first: first && i === 0,
              firstCol: f === '#0',
              lastCol: f === '#3',
            },
          ],
        ];
      }
      return dataToRows(
        [
          initial && j === 0 ? '#0' : '#1',
          ...(f.fields.length === 0 ? [''] : f.fields),
          initial && j === fields.length - 1 ? '#3' : '#2',
        ],
        (values || {})[f.alias || f.name],
        type ? (root.rgo.schema[type][f.name] as any).type : f.name,
        f.start || 0,
        false,
        first && i === 0,
      );
    });
    const height = Math.max(...dataBlocks.map(rows => rows.length));
    return [
      ...result,
      ...dataBlocks.reduce((res, rows) => {
        rows.forEach((row, j) => {
          res[j] = [
            ...(res[j] || []),
            ...row.map(
              v => (v.span === undefined ? { ...v, span: height } : v),
            ),
          ];
        });
        if (rows[0][0].span !== undefined && height > rows.length) {
          res[rows.length] = [
            ...(res[rows.length] || []),
            ...Array.from({ length: rows[0].length }).map((_, j) => ({
              ...rows[0][j],
              text: undefined,
              span: height - rows.length,
              first: false,
              empty: true,
            })),
          ];
        }
        return res;
      }, []),
    ];
  }, []);
};
