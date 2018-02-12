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
              start: (f.start || 0) + 1,
              end: f.end === undefined ? f.end : f.end + 1,
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
              type: newType,
              path: `${newPath}.${
                newRows[0].filter(d => !d.name.startsWith('#')).length
              }`,
              last: i === fields.length - 1 && nextPath,
            },
          );
          newRows.forEach((r, j) => {
            rows[j + 1] = [...(rows[j + 1] || []), ...r];
          });
          return rows;
        },
        [[]],
      );

export const dataToRows = (fields, data, first = true, last = true) => {
  const dataArray = Array.isArray(data) ? data : [data];
  if (dataArray.length === 0) dataArray.push(null);
  return dataArray.reduce((result, values, i) => {
    const dataBlocks = fields.map(f => {
      if (typeof f === 'string') {
        return [
          [
            {
              field: f,
              value: f.startsWith('#') ? i + 1 : values && values[f],
              first: first && i === 0,
              last: last && i === dataArray.length - 1,
              span: 1,
            },
          ],
        ];
      }
      return dataToRows(
        ['#1', ...(f.fields.length === 0 ? [''] : f.fields), '#2'],
        values && values[f.alias || f.name],
        first && i === 0,
        last && i === dataArray.length - 1,
      );
    });
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
};
