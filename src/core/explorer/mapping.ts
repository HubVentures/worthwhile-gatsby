import { root } from 'common';

export const fieldToRows = (
  { sort = [] as any, fields },
  type = null as 'string' | null,
  path = '',
) =>
  fields.length === 0
    ? [[{ name: '', type, path: path ? `${path}.${0}` : '0' }]]
    : fields.reduce(
        (rows, f, i) => {
          const newPath = path ? `${path}.${i}` : `${i}`;
          const nextPath = path ? `${path}.${i + 1}` : `${i + 1}`;
          if (typeof f === 'string') {
            rows[0].push({
              name: f,
              type,
              isList: (root.rgo.schema[type!][f] as any).isList,
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
              start: f.start || 0,
              end: f.end,
              firstCol: i === 0 && !path,
            },
            {
              name: f.name,
              type: newType,
              path: newPath,
              span: newRows[0].reduce((res, g) => res + (g.span || 1), 0),
              filter: f.filter,
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
  start = 0,
  initial = true,
  first = true,
) => {
  const dataArray = Array.isArray(data) ? data : [data];
  if (dataArray.length === 0) dataArray.push(null);
  return dataArray.reduce((result, values, i) => {
    const dataBlocks = fields.map((f, j) => {
      if (typeof f === 'string') {
        return [
          [
            {
              field: f,
              value:
                values !== undefined && f.startsWith('#')
                  ? start + i + 1
                  : values && (values[f] || null),
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
              value: undefined,
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
