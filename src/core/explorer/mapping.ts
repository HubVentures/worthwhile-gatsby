import { root } from 'common';

export const fieldToRows = (
  { sort = [] as any, fields },
  type = null as 'string' | null,
  path = '',
) =>
  fields.reduce(
    (rows, f, i) => {
      if (typeof f === 'string') {
        rows[0].push({
          name: f,
          type,
          path: `${path}.${i}`,
          sort: sort.includes(f)
            ? 'asc'
            : sort.includes(`-${f}`) ? 'desc' : null,
          last: i === fields.length - 1 && `${path}.${i + 1}`,
        });
        return rows;
      }
      const newType = type
        ? (root.rgo.schema[type][f.name] as any).type
        : f.name;
      const newRows = fieldToRows(f, newType, `${path}.${i}`);
      rows[0].push(
        { name: '#1', type: type, path: `${path}.${i}` },
        {
          name: f.name,
          type,
          path: `${path}.${i}`,
          span: newRows[0].reduce((res, g) => res + (g.span || 1), 0),
        },
        {
          name: '#2',
          type: newType,
          path: `${path}.${i}.${
            newRows[0].filter(d => !d.name.startsWith('#')).length
          }`,
          last: `${path}.${i + 1}`,
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
    const dataBlocks = fields.map(
      f => {
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
          ['#1', ...f.fields, '#2'],
          values && values[f.alias || f.name],
          first && i === 0,
          last && i === dataArray.length - 1,
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
};
