import { root } from 'common';

const fieldToRows = (
  context,
  { sort = [] as any, fields },
  type,
  path,
  baseIndex = 0,
) =>
  fields.length === 0
    ? [
        [
          {
            name: '',
            type,
            path: path ? `${path}.${0}` : `${baseIndex}`,
            text: !path && !baseIndex ? 'Explore' : 'Add field',
          },
        ],
      ]
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
              text: context.config.fieldName(f, type),
            });
            return rows;
          }
          const newType = type
            ? (root.rgo.schema[type][f.name] as any).type
            : f.name;
          const newRows = fieldToRows(context, f, newType, newPath);
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
              text: type
                ? context.config.fieldName(f.name, type)
                : context.types[f.name],
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

export default fieldToRows;
