import * as React from 'react';
import { Div, Txt } from 'elmnt';
import { compose, context, enclose, pure, withSize } from 'mishmash';

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
      name,
      type,
      span,
      path,
      filter,
      sort,
      last,
      start,
      end,
      noLeft,
      noRight,
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
      isPathPaging,
      isPathFilter,
      setActive,
      color,
      setWidthElem,
      width,
    }) => (
      <td
        style={{
          padding: !name.startsWith('#') && '11px 10px 10px 10px',
          position: 'relative',
          verticalAlign: 'top',
          background:
            (path.split('.').length + (name === '#2' ? 1 : 0)) % 2 === 0
              ? '#e5e5e5'
              : '#f6f6f6',
          ...(live && !span ? { width } : {}),
        }}
        colSpan={span || 1}
        rowSpan={rowSpan}
        ref={!span ? setWidthElem : undefined}
      >
        {live && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: noRight ? 0 : -1,
              bottom: span ? -1 : -2,
              left: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                borderTopWidth: span || name.startsWith('#') ? 2 : 1,
                borderRightWidth: !noRight && (name === '#2' && 2),
                borderLeftWidth: !noLeft && (name === '#1' ? 2 : !span && 1),
                borderStyle: 'solid',
                borderColor: '#ccc',
              }}
            />
            {span && (
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 0,
                  width: 1,
                  bottom: 1,
                  background: alt ? '#e5e5e5' : '#f6f6f6',
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
                    left: noLeft ? 1 : 0,
                    zIndex: name ? 20 : 5,
                  }}
                >
                  <AddField
                    wide={!name}
                    type={type}
                    path={path}
                    clickAdd={clickAdd}
                    active={isPathAdd}
                    setActive={setActive}
                    noLeft={noLeft}
                  />
                </div>
              )}
            {last && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: noRight ? 1 : 0,
                  width: 1,
                  zIndex: 20,
                }}
              >
                <AddField
                  type={type}
                  path={last}
                  clickAdd={clickAdd}
                  active={isLastPathAdd}
                  setActive={setActive}
                  noRight={noRight}
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
                  zIndex: 5,
                }}
              />
            )}
            {name &&
              !span &&
              !name.startsWith('#') && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    zIndex: 5,
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
            {name &&
              !name.startsWith('#') && (
                <div
                  style={{
                    position: 'absolute',
                    ...(span
                      ? { top: 0, height: 1 }
                      : { height: '50%', bottom: 0 }),
                    left: 0,
                    right: 0,
                    zIndex: span ? 4 : 5,
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
            noLeft={noLeft}
          />
        )}
        {!name.startsWith('#') && (
          <Div style={{ spacing: 15, layout: 'bar' }}>
            <Txt
              style={{
                ...textStyle,
                fontWeight: 'bold',
                color,
                cursor: 'default',
                position: 'relative',
                userSelect: 'none',
                MozUserSelect: 'none',
                WebkitUserSelect: 'none',
                msUserSelect: 'none',
              }}
            >
              {name}
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
