import * as React from 'react';
import { Div, Txt } from 'elmnt';
import { pure } from 'mishmash';

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

export default pure(
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
      }}
      colSpan={span || 1}
      rowSpan={rowSpan}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: -1,
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
            borderRightWidth: name === '#2' && 2,
            borderLeftWidth: name === '#1' ? 2 : !span && 1,
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
                left: 0,
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
              />
            </div>
          )}
        {last && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
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
      {name === '#1' && (
        <PageField
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
