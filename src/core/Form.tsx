import * as React from 'react';
import { Div, Icon, Txt } from 'elmnt';
import { withHover, Wrap } from 'mishmash';
import { Spinner } from 'common-client';

import createForm from './createForm';
import styles, { colors, icons } from './styles';

const errorStyle = {
  ...styles.text,
  color: colors.red,
  fontWeight: 'bold' as 'bold',
  fontStyle: 'italic' as 'italic',
};

export default createForm(({ blocks, attempted, submit, invalid, button }) => (
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
        <Wrap hoc={withHover}>
          {({ isHovered, hoverProps }) => (
            <Txt
              onClick={submit}
              {...hoverProps}
              style={{ ...styles.button(isHovered), width: 200 }}
            >
              {button || 'Submit'}
            </Txt>
          )}
        </Wrap>
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
));
