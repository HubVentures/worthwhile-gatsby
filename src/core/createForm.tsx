import * as React from 'react';
import { branch, compose, render } from 'mishmash';
import { Div, Mark, Txt } from 'elmnt';
import { createForm } from 'common-client';

import styles, { colors } from './styles';

export default (container, admin: boolean = false) =>
  createForm(
    container,
    ['title', 'info'],
    branch(
      ({ fields }) => !fields,
      compose(
        branch(
          ({ title }) => title,
          render(({ title, info }) => (
            <Div style={{ spacing: 15, paddingBottom: 10 }}>
              <Txt style={styles.title}>{title}</Txt>
              <Mark style={styles.markdown}>{info}</Mark>
            </Div>
          )),
        ),
        branch(
          ({ info }) => info,
          render(({ info }) => (
            <Mark
              style={{
                ...styles.markdown,
                fontSize: 14,
                background: '#eaeaea',
                borderRadius: 3,
                padding: 15,
              }}
            >
              {info}
            </Mark>
          )),
        ),
        render(),
      ),
    ),
    compose(),
    {
      ...styles.field,
      ...(admin ? { fontSize: 15, padding: 7 } : {}),
      question: { fontWeight: 'bold' },
      required: { color: colors.red },
      prompt: { fontSize: 13, fontStyle: 'italic', color: '#888' },
      column: {
        fontSize: 14,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
      },
    },
    admin,
  );
