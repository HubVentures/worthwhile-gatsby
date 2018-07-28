import * as React from 'react';
import r, { branch } from 'refluent';
import { Div, Hover, Icon, Mark, Txt } from 'elmnt';
import { createForm, Spinner } from 'common-client';

import styles, { colors, icons } from './styles';

const errorStyle = {
  ...styles.text,
  color: colors.red,
  fontWeight: 'bold' as 'bold',
  fontStyle: 'italic' as 'italic',
};

export default createForm(
  ({ blocks, attempted, submit, invalid, button }) => (
    <Div style={{ spacing: 25 }}>
      {blocks ? (
        blocks.reduce((res, blockSet, i) => [
          ...res,
          i !== 0
            ? [
                <div
                  style={{
                    background: '#888',
                    height: 4,
                    borderRadius: 10,
                    margin: '20px 0',
                  }}
                />,
              ]
            : [],
          ...blockSet,
        ])
      ) : (
        <Spinner style={{ color: colors.blue }} />
      )}
      {blocks && (
        <Div style={{ spacing: 10 }}>
          <Hover style={{ ...styles.button, width: 200 }}>
            {({ hoverProps, style }) => (
              <Txt onClick={submit} {...hoverProps} style={style}>
                {button || 'Submit'}
              </Txt>
            )}
          </Hover>
          {invalid &&
            attempted && (
              <Div style={{ layout: 'bar', spacing: 12, margin: '0 auto' }}>
                <Icon {...icons.error} style={errorStyle} />
                <Txt style={errorStyle}>Please correct any errors.</Txt>
              </Div>
            )}
        </Div>
      )}
    </Div>
  ),
  ['title', 'info'],
  r.yield(
    branch(
      ({ fields }) => !fields,
      ({ title, info }) =>
        title ? (
          <Txt style={{ ...styles.title, padding: '5px 0 5px' }}>{title}</Txt>
        ) : info ? (
          <Mark style={styles.markdown}>{info}</Mark>
        ) : null,
    ),
  ),
  r,
  {
    ...styles.field,
    question: { fontWeight: 'bold' },
    required: { color: colors.red },
    prompt: { fontSize: 13, fontStyle: 'italic', color: '#888' },
    column: { fontSize: 14, fontWeight: 'bold', fontStyle: 'italic' },
  },
  false,
);
