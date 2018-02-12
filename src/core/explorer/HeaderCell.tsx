import * as React from 'react';
import { Txt } from 'elmnt';
import { compose, pure, logChanges } from 'mishmash';

import { colors } from '../styles';

import AddField from './AddField';
import RemoveField from './RemoveField';
import SortField from './SortField';

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  color: colors.black,
};

export default compose(pure, logChanges('cell'))(
  ({
    name,
    type,
    span,
    path,
    sort,
    last,
    i,
    j,
    rows,
    row,
    alt,
    isPathAdd,
    isLastPathAdd,
    isPathSort,
    isSiblingSort,
    isPathRemove,
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
      rowSpan={span ? 1 : rows.length - i}
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
                bottom: 0,
                left: 0,
                width: 1,
                zIndex: 10,
              }}
            >
              <AddField
                type={type}
                path={path}
                active={isPathAdd}
                setActive={setActive}
              />
            </div>
          )}
        {last &&
          (name !== '#2' || (i === 0 && j === row.length - 1)) && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: 1,
                zIndex: 10,
              }}
            >
              <AddField
                type={type}
                path={last}
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
        {!span &&
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
                active={isPathSort}
                setActive={setActive}
              />
            </div>
          )}
        {!name.startsWith('#') && (
          <div
            style={{
              position: 'absolute',
              ...(span ? { top: 0 } : { height: '50%' }),
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: span ? 4 : 5,
            }}
          >
            <RemoveField
              relation={span}
              path={path}
              active={isPathRemove}
              setActive={setActive}
            />
          </div>
        )}
      </div>
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
        {name.startsWith('#') ? null : name}
      </Txt>
    </td>
  ),
);
