import * as React from 'react';
import { Div, Txt } from 'elmnt';
import { compose, context, enclose, pure, withSize } from 'mishmash';
import { root } from 'common';

import { colors } from '../styles';

import AddField from './AddField';
import FilterField from './FilterField';
import PageField from './PageField';
import RemoveField from './RemoveField';
import SortField from './SortField';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: colors.black,
};

const getFieldName = (types, type, field) => {
  if (field === 'id') return 'Id';
  if (types[field]) return types[field];
  if (!type || !root.rgo.schema[type][field]) return field;
  return root.rgo.schema[type][field].meta.name || field;
};

const HeaderCellBuilder = live =>
  compose(
    pure,
    context('store'),
    ...(!live
      ? [
          withSize(
            (props, width) =>
              props.store.set(`${props.path}_${props.name}_width`, width),
            'setWidthElem',
            ({ width }) => width,
          ),
        ]
      : [
          enclose(({ initialProps, onProps, setState }) => {
            let key;
            let unlisten;
            const update = props => {
              if (props) {
                const newKey = `${props.path}_${props.name}_width`;
                if (newKey !== key) {
                  key = newKey;
                  unlisten && unlisten();
                  unlisten = props.store.listen(key, width =>
                    setState({ width }),
                  );
                }
              } else {
                unlisten();
              }
            };
            update(initialProps);
            onProps(update);
            return (props, state) => ({ ...props, ...state });
          }),
        ]),
  )(
    ({
      types,
      name,
      type,
      isList,
      span,
      path,
      filter,
      sort,
      last,
      start,
      end,
      firstCol,
      lastCol,
      rowSpan,
      alt,
      updateFilter,
      clickSort,
      updatePaging,
      clickAdd,
      clickRemove,
      focused,
      isPathAdd,
      isLastPathAdd,
      isPathSort,
      isSiblingSort,
      isPathRemove,
      isChildRemove,
      isPathPaging,
      isPathFilter,
      setActive,
      color,
      setWidthElem,
      width,
    }) => (
      <td
        style={{
          position: 'relative',
          verticalAlign: 'top',
          background:
            name === '' && isPathAdd ? colors.blue : alt ? '#e0e0e0' : '#eee',
          paddingTop: span || name.startsWith('#') ? 9 : 10,
          paddingRight: 10,
          paddingBottom: 10,
          paddingLeft: span ? 11 : 10,
          borderTopWidth: span || name.startsWith('#') ? 2 : 1,
          borderRightWidth: !lastCol && name === '#2' && 1,
          borderBottomWidth: !span && 2,
          borderLeftWidth: !firstCol && (name === '#1' ? 2 : !span && 1),
          ...(name === '' && path === '0'
            ? {
                borderTopWidth: 2,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                borderLeftWidth: 0,
              }
            : {}),
          borderStyle: 'solid',
          borderColor: '#ccc',
          ...(live && !span ? { width } : {}),
        }}
        colSpan={span || 1}
        rowSpan={rowSpan}
      >
        <div
          style={{
            position: 'absolute',
            left: (!firstCol && (name === '#1' ? -2 : !span && -1)) || 0,
            right: !lastCol && name === '#2' ? -1 : 0,
          }}
          ref={!span ? setWidthElem : undefined}
        />
        {live && (
          <div
            style={{
              position: 'absolute',
              top: span || name.startsWith('#') ? -2 : -1,
              right: !lastCol && name === '#2' ? -2 : -1,
              bottom: !span ? -2 : -1,
              left: !firstCol && name === '#1' ? -2 : -1,
            }}
          >
            {span && (
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 0,
                  bottom: 1,
                  width: 1,
                  background: alt ? '#e0e0e0' : '#eee',
                  zIndex: 1,
                }}
              />
            )}
            {!span &&
              name !== '#2' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    ...(name ? { width: 1 } : { right: 0 }),
                    bottom: 0,
                    left: firstCol ? 2 : 0,
                    zIndex: name ? 20 : 5,
                  }}
                >
                  <AddField
                    types={types}
                    wide={!name}
                    type={type}
                    path={path}
                    clickAdd={clickAdd}
                    active={isPathAdd}
                    setActive={setActive}
                    focused={isPathAdd && focused}
                    firstCol={firstCol}
                    empty={name === ''}
                  />
                </div>
              )}
            {last && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: lastCol ? 2 : 0,
                  width: 1,
                  zIndex: 20,
                }}
              >
                <AddField
                  types={types}
                  type={type}
                  path={last}
                  clickAdd={clickAdd}
                  active={isLastPathAdd}
                  setActive={setActive}
                  focused={isLastPathAdd && focused}
                  lastCol={lastCol}
                />
              </div>
            )}
            {isSiblingSort && (
              <div
                style={{
                  position: 'absolute',
                  top: -1,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: colors.blue,
                  zIndex: 10,
                }}
              />
            )}
            {name &&
              !isList &&
              !span &&
              !name.startsWith('#') && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    zIndex: 10,
                  }}
                >
                  <SortField
                    sort={sort}
                    path={path}
                    clickSort={clickSort}
                    active={isPathSort}
                    activeSibling={isSiblingSort}
                    setActive={setActive}
                  />
                </div>
              )}
            {!span &&
              isChildRemove && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    left: 0,
                    height: 3,
                    background: colors.red,
                    zIndex: 1,
                  }}
                />
              )}
            {name &&
              !name.startsWith('#') && (
                <div
                  style={{
                    position: 'absolute',
                    ...(span
                      ? {
                          left: -10,
                          right: -10,
                          top: path.indexOf('.') === -1 ? -2 : -2,
                          bottom: 6,
                        }
                      : { left: 0, right: 0, bottom: 0, height: '50%' }),
                    zIndex: span ? 4 : 10,
                  }}
                >
                  <RemoveField
                    relation={span}
                    path={path}
                    clickRemove={clickRemove}
                    active={isPathRemove}
                    setActive={setActive}
                  />
                </div>
              )}
          </div>
        )}
        {name === '#1' && (
          <PageField
            live={live}
            start={start}
            end={end}
            path={path}
            updatePaging={updatePaging}
            active={isPathPaging}
            focused={isPathPaging && focused}
            setActive={setActive}
          />
        )}
        {!name.startsWith('#') && (
          <Div style={{ spacing: 15, layout: 'bar' }}>
            <Txt
              style={{
                ...textStyle,
                fontWeight: 'bold',
                color:
                  name === ''
                    ? isPathAdd ? colors.white : colors.blue
                    : color,
                cursor: 'default',
                position: 'relative',
                userSelect: 'none',
                MozUserSelect: 'none',
                WebkitUserSelect: 'none',
                msUserSelect: 'none',
              }}
            >
              {name === ''
                ? path === '0' ? 'Choose data type...' : 'Add field...'
                : getFieldName(types, type, name)}
            </Txt>
            {span && (
              <FilterField
                live={live}
                type={type}
                filter={filter}
                path={path}
                updateFilter={updateFilter}
                active={isPathFilter}
                focused={isPathFilter && focused}
                setActive={setActive}
              />
            )}
          </Div>
        )}
      </td>
    ),
  );

export const HeaderCell = HeaderCellBuilder(true);
export const ShadowHeaderCell = HeaderCellBuilder(false);
