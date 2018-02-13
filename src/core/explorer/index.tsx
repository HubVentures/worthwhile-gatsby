import * as React from 'react';
import { branch, compose, context, enclose, render } from 'mishmash';
import { Spinner } from 'common-client';
import { root } from 'common';
import { fieldIs } from 'rgo';

import { colors } from '../styles';

import Header from './Header';
import { dataToRows, fieldToRows } from './mapping';
import Table from './Table';

import { data, initialQuery } from './test';

export default compose(
  enclose(
    ({ setState }) => {
      window.rgo.query().then(() => setState({ loading: false }));
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
          console.log(values);
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
  enclose(
    ({ setState }) => {
      let query = initialQuery;
      const updateFilter = (path, filter) => {
        const splitPath = path.split('.');
        const f = splitPath.reduce((res, i) => res.fields[i], {
          fields: query,
        });
        f.filter = filter;
        setState({
          fieldRows: fieldToRows({ fields: query }),
          dataRows: dataToRows(query, data),
        });
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
        setState({
          fieldRows: fieldToRows({ fields: query }),
          dataRows: dataToRows(query, data),
        });
      };
      const updatePaging = (path, start, end) => {
        const splitPath = path.split('.');
        const f = splitPath.reduce((res, i) => res.fields[i], {
          fields: query,
        });
        f.start = start - 1;
        f.end = end && end - 1;
        if (!f.end) delete f.end;
        setState({
          fieldRows: fieldToRows({ fields: query }),
          dataRows: dataToRows(query, data),
        });
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
          type && fieldIs.scalar(root.rgo.schema[type][field])
            ? field
            : { name: field, fields: [] },
        );
        setState({
          fieldRows: fieldToRows({ fields: query }),
          dataRows: dataToRows(query, data),
        });

        // const parentPath = splitPath.slice(0, -1).join('.');
        // let i = index;
        // while (i < parent.fields.length) {
        //   initialProps.store.set(
        //     `${parentPath}.${i + 1}_width`,
        //     initialProps.store.get(`${parentPath}.${i}_width`),
        //   );
        //   if (typeof parent.fields[i + 1] === 'object') {
        //     const subIndex = parent.fields[i + 1].fields.length;
        //     initialProps.store.set(
        //       `${parentPath}.${i + 1}.${subIndex}_width`,
        //       initialProps.store.get(`${parentPath}.${i}.${subIndex}_width`),
        //     );
        //   }
        //   i++;
        // }
      };
      const clickRemove = path => {
        const splitPath = path.split('.');
        const index = parseInt(splitPath[splitPath.length - 1], 10);
        const parent = splitPath
          .slice(0, -1)
          .reduce((res, i) => res.fields[i], { fields: query });

        // const parentPath = splitPath.slice(0, -1).join('.');
        // let i = parent.fields.length;
        // while (i >= index) {
        //   initialProps.store.set(
        //     `${parentPath}.${i}_width`,
        //     initialProps.store.get(`${parentPath}.${i + 1}_width`),
        //   );
        //   i--;
        // }

        parent.fields.splice(index, 1);
        setState({
          fieldRows: fieldToRows({ fields: query }),
          dataRows: dataToRows(query, data),
        });
      };
      const setSize = size => setState({ size });
      return (props, state) => ({
        ...props,
        ...state,
        updateFilter,
        clickSort,
        updatePaging,
        clickAdd,
        clickRemove,
        setSize,
      });
    },
    () => ({
      fieldRows: fieldToRows({ fields: initialQuery }),
      dataRows: dataToRows(initialQuery, data),
      size: {},
    }),
  ),
  enclose(() => {
    let scrollElem;
    const setScrollElem = e => (scrollElem = e);
    let scrollerElem;
    const setScrollerElem = e => (scrollerElem = e);
    const setScroll = () =>
      false &&
      scrollElem &&
      scrollerElem &&
      (scrollElem.style.left = `-${scrollerElem.scrollLeft}px`);
    return (props, state) => ({
      ...props,
      ...state,
      setScrollElem,
      setScrollerElem,
      setScroll,
    });
  }),
)(
  ({
    fieldRows,
    dataRows,
    updateFilter,
    clickSort,
    updatePaging,
    clickAdd,
    clickRemove,
    size,
    setSize,
  }) => (
    <div style={{ padding: '50px', height: '100%' }}>
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <div
          style={{
            position: 'relative',
            height: size.height && size.height + 2,
            maxHeight: '100%',
            width: size.width && size.width + 4,
            maxWidth: '100%',
            overflow: 'scroll',
            borderLeft: '2px solid #ccc',
            borderRight: '2px solid #ccc',
            borderBottom: '2px solid #ccc',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: size.width,
              height: '100%',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                overflow: 'hidden',
              }}
            >
              <div style={{ width: 100000 }}>
                <Header
                  fieldRows={fieldRows}
                  updateFilter={updateFilter}
                  clickSort={clickSort}
                  updatePaging={updatePaging}
                  clickAdd={clickAdd}
                  clickRemove={clickRemove}
                />
              </div>
            </div>
            <div style={{ height: '100%', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  paddingRight: 50,
                  marginRight: -50,
                  overflow: 'scroll',
                }}
              >
                <Table
                  fieldRows={fieldRows}
                  dataRows={dataRows}
                  setSize={setSize}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
);
