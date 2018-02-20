import * as React from 'react';
import { Div, Icon, Txt } from 'elmnt';
import { enclose, Use, withHover } from 'mishmash';
import { root } from 'common';

import download from './download';
import jsonUrl from './jsonUrl';

import { colors, icons } from '../styles';

const buttonStyle = isHovered => ({
  display: 'inline-block',
  verticalAlign: 'top',
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  textAlign: 'center',
  color: isHovered ? colors.white : colors.blue,
  fontWeight: 'bold' as 'bold',
  padding: '10px 20px',
  userSelect: 'none',
  cursor: 'pointer',
  background: isHovered && colors.blue,
});

const Button = ({ onClick = undefined, style, children }) => (
  <Use hoc={withHover}>
    {({ hoverProps, isHovered }) => (
      <Txt
        onClick={onClick}
        {...hoverProps}
        style={{ ...style, ...buttonStyle(isHovered) }}
      >
        {children}
      </Txt>
    )}
  </Use>
);

export default enclose(({ initialProps, onProps, setState, methods }) => {
  initialProps.context.store.watch(
    'initial',
    (initial = {}) => setState({ editing: Object.keys(initial).length > 0 }),
    onProps,
  );
  const clear = () => {
    root.rgo.set(
      ...Object.keys(initialProps.store.get('initial') || {}).map(k => ({
        key: k.split('.') as [string, string, string],
        value: undefined,
      })),
    );
    initialProps.store.set('initial', {});
  };
  return (props, state) => ({
    ...props,
    ...state,
    ...methods({
      save: () => {
        root.rgo.commit(
          ...(Object.keys(initialProps.store.get('initial') || {}).map(k =>
            k.split('.'),
          ) as [string, string, string][]),
        );
        initialProps.store.set('initial', {});
      },
      clear,
      reset: () => {
        clear();
        initialProps.context.reset();
      },
      permalink: () => {
        window.open(
          `${window.location.protocol}//${
            window.location.host
          }/dashboard?${jsonUrl.stringify(props.query)}`,
        );
      },
      download: () => {
        download(props.context, props.query, props.data);
      },
    }),
  });
})(({ reset, download, permalink, save, clear, editing }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 36,
      background: '#eee',
      border: '2px solid #ccc',
    }}
  >
    <Button onClick={reset} style={{ float: 'left' }}>
      Reset
    </Button>
    <Button onClick={download} style={{ float: 'left' }}>
      Download
    </Button>
    <Button onClick={permalink} style={{ float: 'left' }}>
      Permalink
    </Button>

    {editing && (
      <>
        <Use hoc={withHover}>
          {({ hoverProps, isHovered }) => (
            <Div
              onClick={save}
              {...hoverProps}
              style={{
                layout: 'bar',
                spacing: 8,
                float: 'right',
                padding: '10px 25px',
                margin: -2,
                background: isHovered ? colors.blueDark : colors.blue,
                cursor: 'pointer',
              }}
            >
              <Txt
                style={{
                  fontFamily: 'Ubuntu, sans-serif',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.white,
                }}
              >
                Save
              </Txt>
              <Icon
                {...icons.tick}
                style={{
                  fontSize: 16,
                  color: colors.white,
                }}
              />
            </Div>
          )}
        </Use>
        <Use hoc={withHover}>
          {({ hoverProps, isHovered }) => (
            <Div
              onClick={clear}
              {...hoverProps}
              style={{
                layout: 'bar',
                spacing: 8,
                float: 'right',
                padding: 10,
                margin: '-2px 2px -2px -2px',
                background: isHovered ? '#999' : '#aaa',
                cursor: 'pointer',
              }}
            >
              <Icon
                {...icons.cross}
                style={{
                  fontSize: 16,
                  color: colors.white,
                }}
              />
            </Div>
          )}
        </Use>
      </>
    )}
  </div>
));
