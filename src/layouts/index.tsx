import * as React from 'react';
import { Txt } from 'elmnt';
import rgo, { resolvers } from 'rgo';
import { root } from 'common';
import { cssBase, StickyFooter } from 'common-client';
import Helmet from 'react-helmet';
import * as webfont from 'webfontloader';

import Menu from '../core/Menu';
import styles from '../core/styles';

const fontsLoadedEvent = document.createEvent('Event');
fontsLoadedEvent.initEvent('fontsLoaded', true, true);
webfont.load({
  google: { families: ['Ubuntu:300,400,700'] },
  active: () => window.dispatchEvent(fontsLoadedEvent),
});

root.rgo = rgo(
  resolvers.fetch(process.env.DATA_URL!, () => {
    const token =
      typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : null;
  }),
  process.env.NODE_ENV !== 'production',
);

export default ({ location, children }) => (
  <>
    <Helmet title="Worthwhile">
      <style>
        {`
        ${cssBase}
        html {
          background: ${
            location.pathname.startsWith('/dashboard') ? 'white' : '#f6f6f6'
          };
        }
        #___gatsby {
          height: 100%;
        }
        @keyframes upload-bar {
          from {
            background-position: 40px 0;
          }
          to {
            background-position: 0 0;
          }
        }
        `}
      </style>
    </Helmet>
    {location.pathname.startsWith('/dashboard') ? (
      children()
    ) : (
      <>
        <Menu active={location.pathname} />
        <StickyFooter
          content={<div style={{ paddingTop: 69 }}>{children()}</div>}
          footer={
            <div style={{ padding: 15, background: 'white' }}>
              <Txt
                style={{
                  ...styles.text,
                  color: '#878787',
                  fontSize: 14,
                  textAlign: 'center',
                  fontWeight: 'normal' as 'normal',
                }}
              >
                &copy; 2018 Worthwhile
              </Txt>
            </div>
          }
        />
      </>
    )}
  </>
);
