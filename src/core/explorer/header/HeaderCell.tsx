import * as React from 'react';
import { Div, Icon, Txt } from 'elmnt';
import { branch, compose, enclose, pure } from 'mishmash';

import { colors, icons } from '../../styles';

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

export default compose(
  pure,
  branch(
    ({ live }) => !live,
    enclose(({ methods }) => props => ({
      ...props,
      ...methods({
        setWidthElem: elem =>
          props.context.setWidthElem(`${props.path}_${props.name}_width`, elem),
      }),
    })),
    enclose(({ initialProps, onProps, setState }) => {
      initialProps.context.store.watch(
        props => `${props.path}_${props.name}_width`,
        width => setState({ width }),
        onProps,
        initialProps,
      );
      return (props, state) => ({ ...props, ...state });
    }),
  ),
)(
  ({
    context,
    rowSpan,
    name,
    type,
    isList,
    span,
    path,
    sort,
    last,
    firstCol,
    lastCol,
    alt,
    live,
    focused,
    isPathAdd,
    isLastPathAdd,
    isPathSort,
    isSiblingSort,
    isPathRemove,
    isChildRemove,
    isPathPaging,
    isPathFilter,
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
        ...(name === '' && path.indexOf('.') === -1
          ? {
              borderTopWidth: 2,
              borderRightWidth: 0,
              borderBottomWidth: 0,
              borderLeftWidth: 0,
            }
          : {}),
        borderStyle: 'solid',
        borderColor: '#ccc',
        ...(live && !span ? { minWidth: width } : {}),
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
            name !== '#2' &&
            !firstCol && (
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
                  context={context}
                  wide={!name}
                  type={type}
                  path={path}
                  active={isPathAdd}
                  focused={isPathAdd && focused}
                  empty={name === ''}
                />
              </div>
            )}
          {last &&
            !lastCol && (
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
                  context={context}
                  type={type}
                  path={last}
                  active={isLastPathAdd}
                  focused={isLastPathAdd && focused}
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
                  context={context}
                  sort={sort}
                  path={path}
                  active={isPathSort}
                  activeSibling={isSiblingSort}
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
                  context={context}
                  relation={span}
                  path={path}
                  active={isPathRemove}
                />
              </div>
            )}
        </div>
      )}
      {name === '#1' && (
        <PageField
          context={context}
          live={live}
          path={path}
          active={isPathPaging}
          focused={isPathPaging && focused}
        />
      )}
      {!name.startsWith('#') && (
        <Div style={{ spacing: 15, layout: 'bar' }}>
          {name === '' && path !== '0' && path.indexOf('.') === -1 ? (
            <Icon
              {...icons.plus}
              style={{
                ...textStyle,
                color: isPathAdd ? colors.white : colors.blue,
              }}
            />
          ) : (
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
                ? path === '0' ? 'Explore' : 'Add field'
                : context.getFieldName(context.types, type, name)}
            </Txt>
          )}
          {span && (
            <FilterField
              context={context}
              live={live}
              type={type}
              path={path}
              active={isPathFilter}
              focused={isPathFilter && focused}
            />
          )}
        </Div>
      )}
    </td>
  ),
);
