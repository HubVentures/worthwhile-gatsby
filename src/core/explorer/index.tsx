import * as React from 'react';
import { branch, compose, context, enclose, render } from 'mishmash';
import { Spinner } from 'common-client';
import { root } from 'common';
import { fieldIs } from 'rgo';

import { colors } from '../styles';

import Table from './Table';

const addAliases = (fields, alias = '') =>
  fields.map((field, i) => {
    if (typeof field === 'string') return field;
    const newAlias = `${alias}_${i}`;
    return {
      ...field,
      alias: newAlias,
      fields: addAliases(field.fields, newAlias),
    };
  });

export default compose(
  enclose(
    ({ setState }) => {
      root.rgo.query().then(() => setState({ loading: false }));
      return (props, { loading }) => ({ ...props, loading });
    },
    { loading: true },
  ),
  branch(
    ({ loading }) => loading,
    render(() => <Spinner style={{ color: colors.blue }} />),
  ),
  enclose(() => {
    const values = {};
    const listeners = {};
    const store = {
      get: key => values[key],
      set: (key, value) => {
        if (value !== values[key]) {
          values[key] = value;
          listeners[key] && listeners[key].forEach(l => l(value));
        }
      },
      listen: (key, listener) => {
        listener(values[key]);
        listeners[key] = listeners[key] || [];
        listeners[key].push(listener);
        return () => listeners[key].splice(listeners[key].indexOf(listener), 1);
      },
      keys: () => Object.keys(values),
    };
    return props => ({ ...props, store });
  }),
  context('store', ({ store }) => store),
  enclose(({ initialProps, setState }) => {
    let query = initialProps.query || [];
    let count = 0;
    const updateQuery = () => {
      const index = ++count;
      const aliasQuery = addAliases(query);
      setState({ query: aliasQuery, fetching: true });
      root.rgo.query(...aliasQuery).then(data => {
        if (index === count) setState({ data, fetching: false });
      });
    };
    updateQuery();

    const updateFilter = (path, filter) => {
      const splitPath = path.split('.');
      const f = splitPath.reduce((res, i) => res.fields[i], {
        fields: query,
      });
      f.filter = filter;
      if (!f.filter) delete f.filter;
      updateQuery();
    };
    const clickSort = path => {
      const splitPath = path.split('.');
      const index = splitPath[splitPath.length - 1];
      const parent = splitPath
        .slice(0, -1)
        .reduce((res, i) => res.fields[i], { fields: query });
      const f = parent.fields[index];
      const ascIndex = (parent.sort || []).indexOf(f);
      const descIndex = (parent.sort || []).indexOf(`-${f}`);
      if (ascIndex !== -1) {
        parent.sort[ascIndex] = `-${f}`;
      } else if (descIndex !== -1) {
        parent.sort.splice(descIndex, 1);
        if (parent.sort.length === 0) delete parent.sort;
      } else if (!parent.sort) {
        parent.sort = [f];
      } else {
        let i = 0;
        while (i !== -1) {
          const s = parent.sort[i];
          if (
            i === parent.sort.length ||
            parent.fields.indexOf(s[0] === '-' ? s.slice(1) : s) > index
          ) {
            parent.sort.splice(i, 0, f);
            i = -1;
          } else {
            i++;
          }
        }
      }
      updateQuery();
    };
    const updatePaging = (path, start, end) => {
      const splitPath = path.split('.');
      const f = splitPath.reduce((res, i) => res.fields[i], {
        fields: query,
      });
      f.start = start;
      f.end = end;
      if (!f.end) delete f.end;
      updateQuery();
    };
    const clickAdd = (path, type, field) => {
      const splitPath = path.split('.');
      const index = parseInt(splitPath[splitPath.length - 1], 10);
      const parent = splitPath
        .slice(0, -1)
        .reduce((res, i) => res.fields[i], { fields: query });
      parent.fields.splice(
        index,
        0,
        field === 'Id' || (type && fieldIs.scalar(root.rgo.schema[type][field]))
          ? field
          : { name: field, fields: [] },
      );
      updateQuery();
    };
    const clickRemove = path => {
      const splitPath = path.split('.');
      const index = parseInt(splitPath[splitPath.length - 1], 10);
      const parent = splitPath
        .slice(0, -1)
        .reduce((res, i) => res.fields[i], { fields: query });

      const f = parent.fields[index];
      const ascIndex = (parent.sort || []).indexOf(f);
      const descIndex = (parent.sort || []).indexOf(`-${f}`);
      if (ascIndex !== -1) parent.sort.splice(ascIndex, 1);
      else if (descIndex !== -1) parent.sort.splice(descIndex, 1);
      if (parent.sort && parent.sort.length === 0) delete parent.sort;

      parent.fields.splice(index, 1);
      updateQuery();
    };

    return (props, state) => ({
      ...props,
      ...state,
      updateFilter,
      clickSort,
      updatePaging,
      clickAdd,
      clickRemove,
    });
  }),
  branch(
    ({ query, data }) => !query || !data,
    render(() => <Spinner style={{ color: colors.blue }} />),
  ),
)(
  ({
    types,
    query,
    data,
    fetching,
    updateFilter,
    clickSort,
    updatePaging,
    clickAdd,
    clickRemove,
  }) => (
    <div style={{ height: '100%', whiteSpace: 'nowrap', overflow: 'auto' }}>
      {Array.from({ length: query.length + 1 }).map((_, i) => (
        <div
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            height: '100%',
            paddingLeft: i !== 0 && 30,
          }}
          key={i}
        >
          <Table
            types={types}
            index={i}
            query={query[i] ? [query[i]] : []}
            data={data}
            fetching={fetching}
            updateFilter={updateFilter}
            clickSort={clickSort}
            updatePaging={updatePaging}
            clickAdd={clickAdd}
            clickRemove={clickRemove}
          />
        </div>
      ))}
    </div>
  ),
);
