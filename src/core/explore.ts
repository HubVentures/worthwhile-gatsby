import { getValueString } from 'common-client';
import { Obj, root } from 'common';
import { Field, fieldIs } from 'rgo';
import { parseFilter } from 'common-client';

import createExplorer from './explorer';

const getFieldName = (typeMap, type, field) => {
  if (field === 'id') return 'Id';
  if (typeMap[field]) return typeMap[field];
  if (!type || !root.rgo.schema[type][field]) return field;
  return root.rgo.schema[type][field].meta.name || field;
};

const printFilter = (filter: any[] | null, fields: Obj<Field>) => {
  if (!filter) return '';
  if (filter[0] === 'AND' || filter[0] === 'OR') {
    return `(${filter
      .slice(1)
      .map(f => printFilter(f, fields))
      .join(filter[0] === 'AND' ? ', ' : ' OR ')})`;
  }
  const field = fields[filter[0]];
  if (!field || !fieldIs.scalar(field)) throw new Error('Invalid field');
  const op = filter.length === 3 ? filter[1] : '=';
  const value = filter[filter.length - 1];
  return `${filter[0]} ${op} ${getValueString(value, field.scalar)}`;
};

const resizer = update => window.addEventListener('fontsLoaded', update);

export default createExplorer({
  getFieldName,
  parseFilter,
  printFilter,
  resizer,
});
