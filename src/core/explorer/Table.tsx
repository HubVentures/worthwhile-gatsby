import * as React from 'react';
import { compose, enclose, map, pure, Use, withSize } from 'mishmash';

import Body from './body';
import Header, { fieldToRows } from './header';

export default compose(
  pure,
  map(props => ({
    ...props,
    fieldRows: fieldToRows({ fields: props.query }, null, '', props.index),
  })),
  withSize('height', 'setHeightElem', ({ height = 0 }) => height),
  enclose(({ initialProps, onProps, setState, methods }) => {
    initialProps.context.store.watch(
      props => `table_${props.index}_width`,
      width => setState({ width }),
      onProps,
      initialProps,
    );
    let elem;
    const noScrollEvent = () => (elem.scrollLeft = 0);
    const setNoScrollElem = e => {
      if (elem) elem.removeEventListener('scroll', noScrollEvent);
      elem = e;
      if (elem) elem.addEventListener('scroll', noScrollEvent);
    };
    return (props, state) => ({
      ...props,
      ...state,
      setNoScrollElem,
      ...methods({
        setSizeElem: elem => {
          props.setHeightElem(elem);
          props.context.setWidthElem(`table_${props.index}_width`, elem);
        },
      }),
    });
  }),
)(
  ({
    context,
    query,
    fetching,
    data,
    fieldRows,
    setNoScrollElem,
    height,
    width,
    setSizeElem,
  }) => (
    <div
      style={{
        position: 'relative',
        height: height + 2,
        maxHeight: '100%',
        borderLeft: '2px solid #ccc',
        borderRight: '2px solid #ccc',
        borderBottom: '2px solid #ccc',
        visibility: height ? 'visible' : 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
        ref={setNoScrollElem}
      >
        <div
          style={{
            height: '100%',
            paddingTop: fieldRows.length * 33 + 1,
            overflow: 'hidden',
          }}
        >
          <div style={{ height: '100%', overflow: 'scroll' }}>
            <div
              style={{
                height: '100%',
                marginTop: -(fieldRows.length * 33 + 1),
              }}
            >
              <div style={{ width, overflow: 'hidden' }}>
                <div style={{ width: 100000 }}>
                  <div style={{ display: 'table' }} ref={setSizeElem}>
                    <Use
                      hoc={pure}
                      context={context}
                      query={query}
                      data={data}
                      fieldRows={fieldRows}
                    >
                      {({ context, query, data, fieldRows }) => (
                        <table
                          style={{
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                            tableLayout: 'fixed',
                          }}
                        >
                          <Header context={context} fieldRows={fieldRows} />
                          <Body context={context} query={query} data={data} />
                        </table>
                      )}
                    </Use>
                  </div>
                </div>
              </div>
              {fetching && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    background: 'rgba(255,255,255,0.9)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 100000,
          }}
        >
          <table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <Header context={context} fieldRows={fieldRows} live />
          </table>
        </div>
      </div>
    </div>
  ),
);
