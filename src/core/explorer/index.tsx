import * as React from 'react';
import { branch, compose, context, enclose, render } from 'mishmash';
import { getValueString, Spinner } from 'common-client';
import { Obj, root } from 'common';
import { Field, fieldIs } from 'rgo';

import { colors } from '../styles';

import Footer from './Footer';
import jsonUrl from './jsonUrl';
import Table from './Table';

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

const initStore = (store, fields, type?, path?) =>
  fields.filter(f => typeof f !== 'string').forEach((f, i) => {
    const newType = type ? (root.rgo.schema[type][f.name] as any).type : f.name;
    const newPath = path ? `${path}.${i}` : `${i}`;
    if (f.filter) {
      store.set(
        `${newPath}_filter`,
        printFilter(f.filter, root.rgo.schema[newType]),
      );
    }
    store.set(`${newPath}_start`, (f.start || 0) + 1);
    if (f.end) store.set(`${newPath}_end`, f.end);
    initStore(store, f.fields || [], newType, newPath);
  });

const addAliases = (fields, alias = '') =>
  fields.map((f, i) => {
    if (typeof f === 'string') return f;
    const newAlias = `${alias}_${i}`;
    return {
      ...f,
      alias: newAlias,
      fields: addAliases(f.fields, newAlias),
    };
  });

const addIds = fields =>
  fields.map(f => {
    if (typeof f === 'string') return f;
    return {
      ...f,
      fields: f.fields.includes('id') ? f.fields : ['id', ...f.fields],
    };
  });

export default compose(
  enclose(({ setState }) => {
    setState({ loading: true });
    root.rgo.query().then(() => setState({ loading: false }));
    const reset = () =>
      setState({ isReset: true }, () => setState({ isReset: false }));
    return (props, state) => ({ ...props, ...state, reset });
  }),
  branch(
    ({ loading, isReset }) => loading || isReset,
    render(() => <Spinner style={{ color: colors.blue }} />),
  ),
  enclose(() => {
    const values = {};
    const listeners = {};
    const listen = (key, listener) => {
      listener(values[key]);
      listeners[key] = listeners[key] || [];
      listeners[key].push(listener);
      return () => listeners[key].splice(listeners[key].indexOf(listener), 1);
    };

    const widthElems = {};
    const updateWidths = () => {
      Object.keys(widthElems).forEach(key => {
        const width = widthElems[key].getBoundingClientRect().width;
        if (width !== values[key]) {
          values[key] = width;
          listeners[key] && listeners[key].forEach(l => l(values[key]));
        }
      });
    };
    window.addEventListener('fontsLoaded', updateWidths);

    const store = {
      get: key => values[key],
      set: (key, value) => {
        if (value !== values[key]) {
          values[key] = value;
          listeners[key] && listeners[key].forEach(l => l(values[key]));
          setTimeout(updateWidths);
        }
      },
      update: (key, map: (v) => any) => {
        values[key] = map(values[key]);
        listeners[key] && listeners[key].forEach(l => l(values[key]));
        setTimeout(updateWidths);
      },
      watch: (key, listener, onProps, initialProps) => {
        const getKey = props => (typeof key === 'string' ? key : key(props));
        let currentKey = getKey(initialProps);
        let unlisten = listen(currentKey, listener);
        onProps(props => {
          const newKey = props && getKey(props);
          if (newKey !== currentKey) {
            unlisten();
            currentKey = newKey;
            if (currentKey) unlisten = listen(currentKey, listener);
          }
        });
      },

      setWidthElem: (key, elem) => {
        if (elem) {
          widthElems[key] = elem;
        } else {
          delete widthElems[key];
          delete values[key];
        }
      },
      updateWidths,
    };
    return props => ({ ...props, store });
  }),
  context('store', ({ store }) => store),
  enclose(({ initialProps, onProps, setState }) => {
    let query = initialProps.query
      ? JSON.parse(JSON.stringify(initialProps.query))
      : jsonUrl.parse(location.search.slice(1)) || [];
    if (query) initStore(initialProps.store, query);

    let unsubscribe;
    const updateQuery = () => {
      const aliasQuery = addAliases(query);
      setState({ query: aliasQuery });
      if (unsubscribe) unsubscribe();
      unsubscribe = root.rgo.query(...addIds(aliasQuery), data => {
        if (!data) setState({ fetching: true });
        else
          setState({ data: { ...data } }, () =>
            setTimeout(() => setState({ fetching: false })),
          );
      });
    };
    updateQuery();
    onProps(props => !props && unsubscribe());

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
      if (!f.start) delete f.start;
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
        field === 'id' || (type && fieldIs.scalar(root.rgo.schema[type][field]))
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

    const clickSave = () => {
      root.rgo.commit(
        ...(Object.keys(initialProps.store.get('initial') || {}).map(k =>
          k.split('.'),
        ) as [string, string, string][]),
      );
      initialProps.store.set('initial', {});
    };
    const clickClear = () => {
      root.rgo.set(
        ...Object.keys(initialProps.store.get('initial') || {}).map(k => ({
          key: k.split('.') as [string, string, string],
          value: undefined,
        })),
      );
      initialProps.store.set('initial', {});
    };
    const clickReset = () => {
      clickClear();
      initialProps.reset();
    };
    const clickPermalink = () => {
      window.open(
        `${window.location.protocol}//${
          window.location.host
        }/dashboard?${jsonUrl.stringify(query)}`,
      );
    };

    return (props, state) => ({
      ...props,
      ...state,
      updateFilter,
      clickSort,
      updatePaging,
      clickAdd,
      clickRemove,
      clickSave,
      clickClear,
      clickReset,
      clickPermalink,
    });
  }),
  branch(
    ({ query, data }) => !query || !data,
    render(() => <Spinner style={{ color: colors.blue }} />),
  ),
)(
  ({
    store,
    types,
    query,
    data,
    fetching,
    updateFilter,
    clickSort,
    updatePaging,
    clickAdd,
    clickRemove,
    clickSave,
    clickClear,
    clickReset,
    clickPermalink,
  }) => (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        paddingBottom: 61,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          whiteSpace: 'nowrap',
          overflow: 'auto',
        }}
      >
        {Array.from({ length: query.length + 1 }).map((_, i) => (
          <div
            style={{
              display: 'inline-block',
              verticalAlign: 'top',
              height: '100%',
              paddingLeft: i !== 0 && 25,
            }}
            key={i}
          >
            <Table
              store={store}
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
      <Footer
        store={store}
        clickSave={clickSave}
        clickClear={clickClear}
        clickReset={clickReset}
        clickPermalink={clickPermalink}
      />
    </div>
  ),
);
