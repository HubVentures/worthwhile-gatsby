import * as React from 'react';
import Helmet from 'react-helmet';

import Explorer from '../core/explorer';

export default () => (
  <>
    <Helmet title="Dashboard | Worthwhile" />
    <Explorer
      types={{
        befrienders: 'Befrienders',
        refugees: 'Refugees',
        ww_people: 'People',
        ww_equalopps: 'Equal opps',
      }}
    />
  </>
);
