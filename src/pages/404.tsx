import * as React from 'react';
import { Div, Txt } from 'elmnt';
import Helmet from 'react-helmet';

import styles from '../core/styles';

export default () => (
  <Div style={{ spacing: 50, padding: '50px 0' }}>
    <Helmet title="Page Not Found | Worthwhile" />

    <Txt style={{ ...styles.text, fontSize: 30, fontWeight: 'bold' }}>
      Sorry, we couldn't find that page!
    </Txt>
  </Div>
);
