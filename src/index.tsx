declare const APP: string;
declare const ELEMENT: string;
declare const SERVER_URL: string;

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ejson, root } from 'common-client';
import rgo, { resolvers } from 'rgo';
import Helmet from 'react-helmet';
import { css } from 'elmnt';

const App = require(`./apps/${APP}`).default;

root.rgo = rgo(
  resolvers.fetch(SERVER_URL, () => {
    const token =
      typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : null;
  }),
  process.env.NODE_ENV !== 'production',
);

const defaults = {};
const elems = document.querySelectorAll(`[${ELEMENT}]`);
for (let i = 0; i < elems.length; ++i) {
  const config = elems[i].getAttribute(ELEMENT)
    ? ejson.parse(elems[i].getAttribute(ELEMENT)!)
    : defaults[APP];
  ReactDOM.render(
    <>
      <Helmet>
        <style>{css.base}</style>
      </Helmet>
      <App {...config} />
    </>,
    elems[i],
  );
}
