import * as React from 'react';
import { branch, compose, enclose, render } from 'mishmash';
import { Spinner } from 'common-client';
import { root } from 'common';

import { colors } from '../styles';

import createQuery from './createQuery';
import createStore from './createStore';
import Footer from './Footer';
import jsonUrl from './jsonUrl';
import Table from './Table';

const initStore = (printFilter, store, fields, type?, path?) =>
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
    initStore(printFilter, store, f.fields || [], newType, newPath);
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

export default config => {
  return compose(
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
    enclose(({ initialProps, onProps, setState }) => {
      const store = createStore();

      const initial =
        initialProps.query || jsonUrl.parse(location.search.slice(1)) || [];
      initStore(config.printFilter, store, initial);
      let unsubscribe;
      const query = createQuery(initial, q => {
        const aliasQuery = addAliases(q);
        setState({ query: aliasQuery });
        if (unsubscribe) unsubscribe();
        unsubscribe = root.rgo.query(...addIds(aliasQuery), data => {
          if (!data) {
            setState({ fetching: true });
          } else {
            setState({ data: { ...data } }, () =>
              setTimeout(() => setState({ fetching: false })),
            );
          }
        });
      });
      onProps(props => !props && unsubscribe());

      const widthElems = {};
      const setWidthElem = (key, elem) => {
        if (elem) {
          widthElems[key] = elem;
        } else {
          delete widthElems[key];
          store.set(key);
        }
      };
      const updateWidths = () => {
        Object.keys(widthElems).forEach(key =>
          store.set(key, widthElems[key].getBoundingClientRect().width),
        );
      };
      store.listen('', updateWidths);
      config.resizer && config.resizer(updateWidths);

      const setActive = (active, focus) => {
        store.update(
          'header',
          (state = {}) =>
            state.activeFocus && !focus
              ? state
              : {
                  activeFocus: active && focus,
                  activeType: active && active.type,
                  activePath: active && active.path,
                },
        );
      };

      let context;
      const updateContext = ({ types, reset }) => {
        context = {
          ...config,
          types,
          reset,
          store,
          query,
          setWidthElem,
          updateWidths,
          setActive,
        };
      };
      updateContext(initialProps);
      onProps(props => props && updateContext(props));

      return (props, state) => ({ ...props, ...state, context });
    }),
    branch(
      ({ query, data }) => !query || !data,
      render(() => <Spinner style={{ color: colors.blue }} />),
    ),
  )(({ context, query, fetching, data }) => (
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
              context={context}
              query={query[i] ? [query[i]] : []}
              fetching={fetching}
              data={data}
              index={i}
            />
          </div>
        ))}
      </div>
      <Footer context={context} query={query} data={data} />
    </div>
  ));
};
