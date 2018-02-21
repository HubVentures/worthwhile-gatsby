import * as React from 'react';
import { css, Div, Icon, Txt } from 'elmnt';
import { branch, compose, enclose, map, pure, restyle } from 'mishmash';

import icons from '../icons';

import AddField from './AddField';
import FilterField from './FilterField';
import PageField from './PageField';
import RemoveField from './RemoveField';
import SortField from './SortField';

export default compose(
  pure,
  map(
    restyle(
      [
        'alt',
        'name',
        'isPathAdd',
        'isLastPathAdd',
        'isPathSort',
        'isSiblingSort',
        'isPathRemove',
        'isChildRemove',
      ],
      (
        alt,
        name,
        isPathAdd,
        isLastPathAdd,
        isPathSort,
        isSiblingSort,
        isPathRemove,
        isChildRemove,
      ) => [
        [
          'mergeKeys',
          {
            header: true,
            alt,
            empty: name === '',
            sort: isPathSort || isSiblingSort,
            remove: isPathRemove || isChildRemove,
            active:
              isPathAdd ||
              isLastPathAdd ||
              isPathSort ||
              isSiblingSort ||
              isPathRemove ||
              isChildRemove,
          },
        ],
      ],
    ),
    restyle(
      ['name', 'path', 'span', 'firstCol', 'lastCol'],
      (name, path, span, firstCol, lastCol) => ({
        base: null,
        td: [
          [
            'scale',
            {
              paddingTop: {
                paddingTop: 1,
                borderTopWidth: span || name.startsWith('#') ? -1 : 0,
              },
              paddingLeft: {
                paddingLeft: 1,
                borderLeftWidth: span ? 1 : 0,
              },
              borderTopWidth: span || name.startsWith('#') ? 2 : 1,
              borderRightWidth: !lastCol && name === '#2' ? 1 : 0,
              borderBottomWidth: !span ? 2 : 0,
              borderLeftWidth:
                (!firstCol && (name === '#1' ? 2 : !span && 1)) || 0,
              ...(name === '' && path.indexOf('.') === -1
                ? {
                    borderTopWidth: 2,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                    borderLeftWidth: 0,
                  }
                : {}),
            },
          ],
          ['merge', { position: 'relative', verticalAlign: 'top' }],
        ],
        fill: [
          [
            'scale',
            {
              top: { borderTopWidth: span || name.startsWith('#') ? -2 : -1 },
              right: {
                borderRightWidth: (!lastCol && (name === '#2' ? -2 : -1)) || 0,
              },
              bottom: { borderBottomWidth: !span ? -2 : -1 },
              left: {
                borderLeftWidth:
                  (!firstCol && (name === '#1' ? -2 : !span && -1)) || 0,
              },
            },
          ],
          ['filter', 'top', 'right', 'bottom', 'left'],
          ['merge', { position: 'absolute' }],
        ],
        icon: [
          ['mergeKeys', 'icon'],
          ['filter', ...css.groups.text, 'background'],
          [
            'scale',
            {
              fontSize: 0.6,
              padding: { fontSize: 0.15 },
              radius: { fontSize: 0.375 },
            },
          ],
          ['merge', { borderRadius: 100 }],
        ],
        text: [
          ['filter', ...css.groups.text],
          [
            'merge',
            {
              cursor: 'default',
              position: 'relative',
              userSelect: 'none',
              MozUserSelect: 'none',
              WebkitUserSelect: 'none',
              msUserSelect: 'none',
            },
          ],
        ],
      }),
    ),
  ),
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
    text,
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
    setWidthElem,
    width,
    style,
  }) => (
    <td
      style={{ ...style.td, ...(live && !span ? { minWidth: width } : {}) }}
      colSpan={span || 1}
      rowSpan={rowSpan}
      ref={!span ? setWidthElem : undefined}
    >
      {live && (
        <div style={style.fill}>
          {span && (
            <div
              style={{
                position: 'absolute',
                top: style.base.borderTopWidth * 2,
                right: 0,
                bottom: style.base.borderBottomWidth,
                width: style.base.borderLeftWidth,
                background: style.td.background,
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
                  ...(name
                    ? { width: style.base.borderLeftWidth }
                    : { right: 0 }),
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
                  style={style}
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
                  width: style.base.borderRightWidth,
                  zIndex: 20,
                }}
              >
                <AddField
                  context={context}
                  type={type}
                  path={last}
                  active={isLastPathAdd}
                  focused={isLastPathAdd && focused}
                  style={style}
                />
              </div>
            )}
          {isSiblingSort && (
            <div
              style={{
                position: 'absolute',
                top: -style.base.borderTopWidth,
                left: 0,
                right: 0,
                height: style.base.borderLeftWidth * 3,
                background: style.icon.background,
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
                  style={style}
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
                  height: style.base.borderBottomWidth * 3,
                  background: style.icon.background,
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
                        left: -style.base.paddingLeft,
                        right: -style.base.paddingRight,
                        top: -style.icon.radius,
                        bottom: style.base.borderTopWidth + style.icon.radius,
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
                  style={style}
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
          style={style}
        />
      )}
      {!name.startsWith('#') && (
        <Div style={{ spacing: style.base.paddingRight * 1.5, layout: 'bar' }}>
          {name === '' && path !== '0' && path.indexOf('.') === -1 ? (
            <Icon {...icons.plus} style={style.text} />
          ) : (
            <Txt style={style.text}>{text}</Txt>
          )}
          {span && (
            <FilterField
              context={context}
              live={live}
              type={type}
              path={path}
              active={isPathFilter}
              focused={isPathFilter && focused}
              style={style}
            />
          )}
        </Div>
      )}
    </td>
  ),
);
