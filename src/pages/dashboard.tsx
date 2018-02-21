import * as React from 'react';
import Helmet from 'react-helmet';
import { config } from 'common-client';

import Explorer from '../core/explorer';

import { colors } from '../core/styles';

const style = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  lineHeight: 1.5,
  color: colors.black,
  padding: 10,
  background: '#eee',
  border: '1px solid #ccc',
  spinner: {
    color: 'blue',
  },
  header: {
    fontWeight: 'bold',
    alt: {
      background: '#e0e0e0',
    },
    empty: {
      color: colors.blue,
      active: { color: colors.white, background: colors.blue },
    },
    sort: { color: colors.blue },
    remove: { color: colors.red },
    icon: {
      color: 'white',
      background: '#aaa',
      active: { background: colors.blue },
      remove: { background: colors.red },
    },
    input: {
      background: 'transparent',
      color: '#aaa',
      padding: 5,
      hover: {
        color: colors.blue,
        background: 'rgba(0,0,0,0.1)',
        focus: {
          color: 'white',
          background: colors.blue,
          connect: { color: colors.blue },
          invalid: { background: colors.red, connect: { color: colors.red } },
        },
      },
    },
    modal: {
      background: 'white',
      padding: '4px 0',
    },
    item: {
      fontWeight: 'normal',
      padding: '7px 14px',
      background: 'white',
      active: { color: 'black' },
      relation: { fontWeight: 'bold' },
      hover: { color: 'white', background: colors.blue },
    },
  },
  data: {
    background: 'white',
    maxWidth: 400,
    hover: { background: '#eee' },
    null: { color: '#ccc', hover: { background: 'white' } },
    empty: { background: '#fafafa' },
    changed: {
      color: colors.blue,
      background: '#f4fbff',
      fontStyle: 'italic',
      fontWeight: 'bold',
    },
    input: {
      boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.15)',
      placeholder: { color: 'rgba(0,0,0,0.35)' },
      selected: { fontWeight: 'bold' },
      group: { fontWeight: 'bold', fontStyle: 'italic' },
      none: { fontStyle: 'italic' },
      focus: {
        borderColor: colors.blue,
        active: { background: colors.blueFaint },
      },
      invalid: {
        background: colors.redExtraFaint,
        borderColor: colors.red,
        focus: {
          borderColor: colors.redDark,
          active: { background: colors.redFaint },
        },
      },
      processing: {
        backgroundColor: '#f2f2f2',
        backgroundImage: `linear-gradient(45deg, ${[
          `${colors.processing} 25%`,
          'transparent 25%',
          'transparent 50%',
          `${colors.processing} 50%`,
          `${colors.processing} 75%`,
          'transparent 75%',
          'transparent',
        ].join(',')})`,
        backgroundSize: '40px 40px',
        animation: 'upload-bar 1s linear infinite',
        focus: { backgroundColor: colors.blueFaint },
      },
      // button: {
      //   textAlign: 'center',
      //   color: colors.white,
      //   fontWeight: 'bold' as 'bold',
      //   letterSpacing: 0.5,
      //   width: 120,
      //   boxShadow: 'none',
      //   background: colors.blue,
      //   hover: { background: colors.blueDark },
      //   focus: {
      //     active: {
      //       background: colors.blue,
      //       hover: { background: colors.blueDark },
      //     },
      //   },
      // },
    },
  },
  link: {
    fontWeight: 'bold',
    color: colors.blue,
    hover: { color: colors.white, background: colors.blue },
  },
  button: {
    fontWeight: 'bold',
    color: colors.white,
    background: colors.blue,
    hover: { background: colors.blueDark },
    cancel: { background: '#999', hover: { background: '#aaa' } },
  },
};

window.onbeforeunload = () => 'Changes that you made may not be saved.';

export default () => (
  <>
    <Helmet title="Dashboard | Worthwhile" />
    <div style={{ padding: '30px', height: '100%' }}>
      <Explorer
        config={config}
        types={{
          befrienders: 'Befrienders',
          refugees: 'Refugees',
          ww_people: 'People',
          ww_equalopps: 'Equal opps',
        }}
        resize={resize => window.addEventListener('fontsLoaded', resize)}
        style={style}
        // query={[
        //   {
        //     name: 'befrienders',
        //     end: 10,
        //     fields: ['firstname', 'lastname', 'address'],
        //   },
        // ]}
      />
    </div>
  </>
);
