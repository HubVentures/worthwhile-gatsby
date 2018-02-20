import { noUndef, root } from 'common';
import { getValueString } from 'common-client';

const csvHeader = (
  context,
  { sort = [] as string[], fields },
  type = null as null | string,
) => {
  if (fields.length === 0) return [['Add field']];
  const blocks = fields.map(f => {
    if (typeof f === 'string') {
      const fieldName = context.getFieldName(context.types, type, f);
      const fieldSort = sort.includes(f)
        ? 'asc'
        : sort.includes(`-${f}`) ? 'desc' : '';
      return [fieldSort ? `${fieldName} [${fieldSort}]` : fieldName];
    }
    const fieldName = context.getFieldName(context.types, type, f.name);
    const newType = type ? (root.rgo.schema[type][f.name] as any).type : f.name;
    const filter = context.printFilter(f.filter, root.rgo.schema[newType]);
    const rows = csvHeader(context, f, newType);
    return [
      [
        `${(f.start || 0) + 1}`,
        ...rows[0].map(
          (_, i) =>
            i === 0 ? (filter ? `${fieldName} (${filter})` : fieldName) : '',
        ),
      ],
      ...rows.map((row, i) => [i === 0 ? `${f.end || ''}` : '', ...row]),
    ];
  });
  const height = Math.max(...blocks.map(rows => rows.length));
  return blocks.reduce((res, rows) => {
    Array.from({ length: height }).forEach((_, i) => {
      res[i] = [...(res[i] || []), ...(rows[i] || rows[0].map(() => ''))];
    });
    return res;
  }, []);
};

const csvData = (
  context,
  fields,
  data,
  type = null as null | string,
  start = 0,
) => {
  const dataArray = Array.isArray(data) ? data : [data];
  if (dataArray.length === 0) dataArray.push(undefined);
  return dataArray.reduce((result, values, i) => {
    const blocks = fields.map(f => {
      if (typeof f === 'string') {
        const value = noUndef(values && values[f]);
        return [
          [
            f === '' || values === undefined
              ? ''
              : f.startsWith('#')
                ? `${start + i + 1}`
                : getValueString(
                    value,
                    f === 'id'
                      ? 'string'
                      : (root.rgo.schema[type!][f] as any).scalar,
                  ),
          ],
        ];
      }
      return csvData(
        context,
        ['#', ...(f.fields.length === 0 ? [''] : f.fields)],
        (values || {})[f.alias || f.name],
        type ? (root.rgo.schema[type][f.name] as any).type : f.name,
        f.start || 0,
      );
    });
    const height = Math.max(...blocks.map(rows => rows.length));
    return [
      ...result,
      ...blocks.reduce((res, rows) => {
        Array.from({ length: height }).forEach((_, j) => {
          res[j] = [...(res[j] || []), ...(rows[j] || rows[0].map(() => ''))];
        });
        return res;
      }, []),
    ];
  }, []);
};

export default (context, query, data, filename = 'data') => {
  const blocks = query.map(q => [
    ...csvHeader(context, { fields: [q] }),
    ...csvData(context, [q], data),
  ]);

  const height = Math.max(...blocks.map(rows => rows.length));
  const allRows = blocks.reduce((res, rows, i) => {
    Array.from({ length: height }).forEach((_, j) => {
      res[j] = [
        ...(res[j] || []),
        ...(i === 0 ? [] : ['']),
        ...(rows[j] || rows[0].map(() => '')),
      ];
    });
    return res;
  }, []);

  const csv = allRows
    .map(row => row.map(s => `°${s.replace(/\n|\r/g, '\r\n')}°`).join(','))
    .join('\r\n')
    .replace(/"/g, '""')
    .replace(/°/g, '"');

  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(`data:text/csv;charset=utf-8,${csv}`));
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
