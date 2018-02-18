import * as React from 'react';
import { Div, Txt } from 'elmnt';
import { branch, compose, enclose, render, Use, withHover } from 'mishmash';
import { Redirect } from 'react-router-dom';
import { Spinner } from 'common-client';

import createForm from '../core/createForm';
import styles, { colors } from '../core/styles';

const FormBar = ({ valid, button, submit }: any) => (
  <Div
    style={{
      background: '#bbb',
      minHeight: 42,
    }}
  >
    {valid && (
      <Use hoc={withHover}>
        {({ isHovered, hoverProps }) => (
          <Txt
            onClick={submit}
            {...hoverProps}
            style={{
              ...styles.button(isHovered),
              fontSize: 22,
              padding: '10px 20px',
              display: 'inline-block',
              float: 'right',
              margin: '0 20px 0 0',
            }}
          >
            {button || 'Save'}
          </Txt>
        )}
      </Use>
    )}
  </Div>
);

export default branch(
  ({ redirect }) => redirect,
  compose(
    enclose(({ setState }) => {
      setState({ values: null });
      return (props, state) => ({
        ...props,
        ...state,
        onSubmit: values => setState({ values }),
      });
    }),
    branch(
      ({ values }) => values,
      render(({ redirect, values }) => <Redirect to={redirect(values)} />),
    ),
  ),
)(
  createForm(
    ({ setHeightElem, height, blocks, invalid, submit, button }) => (
      <div>
        <FormBar valid={blocks && !invalid} button={button} submit={submit} />
        <div
          style={{
            background: '#eee',
            borderLeft: '5px solid #bbb',
            padding: '40px 20px',
          }}
        >
          <div
            ref={setHeightElem}
            style={{ position: 'relative', height, minHeight: 60 }}
          >
            {blocks ? (
              <Div style={{ spacing: 20 }}>
                {blocks.reduce(
                  (res, blockSet, i) => [
                    ...res,
                    ...(i !== 0
                      ? [
                          <div
                            style={{
                              height: 4,
                              background: '#bbb',
                              margin: '20px 0',
                            }}
                            key={i}
                          />,
                        ]
                      : []),
                    ...blockSet,
                  ],
                  [],
                )}
              </Div>
            ) : (
              <Spinner
                style={{
                  color: colors.blue,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
          </div>
        </div>
        <FormBar valid={blocks && !invalid} button={button} submit={submit} />
      </div>
    ),
    true,
  ),
);
