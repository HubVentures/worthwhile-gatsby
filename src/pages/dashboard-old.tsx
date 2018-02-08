import * as React from 'react';
import Helmet from 'react-helmet';
import { compose, withHover } from 'mishmash';
import { Div, Mark, Txt } from 'elmnt';
import { encodeId } from 'common';
import {
  Breadcrumbs,
  Link,
  Route,
  routerPure,
  withRouter,
} from 'common-client';
import * as moment from 'moment';

import applyBlocks from '../blocks/apply';
import styles, { colors } from '../core/styles';

import auth from '../core/auth';
import { FormsRoute, LinksRoute } from '../core/Routes';

const duration = (date?: Date) =>
  date &&
  `${moment(date).format('DD/MM/YY')}    (${moment(date).fromNow()})`.replace(
    / /g,
    '\xa0',
  );

const MarkLink = withHover<any>(({ to, text, isHovered, hoverProps }) => (
  <Link to={to} route>
    <div
      {...hoverProps}
      style={{
        padding: 15,
        background: isHovered ? colors.purpleDark : colors.purple,
      }}
    >
      <Mark
        style={{
          ...styles.markdown,
          fontSize: 16,
          color: 'white',
          heading: { fontSize: 30 },
        }}
      >
        {text}
      </Mark>
    </div>
  </Link>
));

const BefriendersLinksRoute = ({
  path,
  title,
  dateLabel,
  dateField,
  screened = false,
  filter,
}) => (
  <LinksRoute
    path={path}
    title={title}
    columns={[
      'Name',
      dateLabel,
      'Region',
      'Sex',
      'Age',
      'Languages',
      'Map',
      ...(screened ? ['Screened'] : []),
    ]}
    rows={[
      {
        name: 'befrienders',
        filter,
        sort: [`-${dateField}`, 'firstname', 'lastname'],
        fields: [
          'id',
          'firstname',
          'lastname',
          dateField,
          'region',
          'sex',
          'dob',
          'languages',
          'mapaddress',
          ...(screened ? ['notes', 'starrating'] : []),
        ],
      },
      ({ befrienders }) =>
        befrienders.map(
          ({
            id,
            firstname,
            lastname,
            region,
            sex,
            dob,
            languages,
            mapaddress,
            notes,
            starrating,
            ...data
          }) => [
            encodeId(id),
            `${firstname || '-'} ${lastname || '-'}`,
            duration(data[dateField]) || '-',
            region || '-',
            sex || '-',
            dob
              ? `${Math.floor(moment().diff(moment(dob), 'y') / 10) * 10}s`
              : '-',
            languages || '-',
            mapaddress ? 'Y' : 'N',
            ...(screened
              ? [notes !== null || starrating !== null ? 'Y' : 'N']
              : []),
          ],
        ),
    ]}
  />
);

const Content = routerPure(() => (
  <div>
    <Route
      path="/"
      exact
      label="Worthwhile"
      render={() => (
        <Div style={{ spacing: 40 }}>
          <Txt style={{ ...styles.header, fontSize: 50 }}>Worthwhile</Txt>
          <Div style={{ spacing: 15 }}>
            <Txt style={{ ...styles.header, fontSize: 30 }}>Befrienders</Txt>
            <MarkLink to="/unmatched" text="# Unmatched" />
            <MarkLink to="/matched" text="# Matched" />
            <MarkLink to="/archived" text="# Archived" />
          </Div>
        </Div>
      )}
    />
    <BefriendersLinksRoute
      path="/unmatched"
      title="Unmatched"
      dateLabel="Registration date"
      dateField="createdat"
      screened
      filter={['AND', ['match', '=', null], ['archived', '=', null]]}
    />
    <BefriendersLinksRoute
      path="/matched"
      title="Matched"
      dateLabel="Start date"
      dateField="startdate"
      filter={['match', '!=', null]}
    />
    <BefriendersLinksRoute
      path="/archived"
      title="Archived"
      dateLabel="Registration date"
      dateField="createdat"
      filter={['archived', '!=', null]}
    />
    <FormsRoute
      path="/:path(person|other)"
      type="ww_people"
      title={[
        ['firstname', 'lastname'],
        ({ firstname, lastname }) => `${firstname} ${lastname}`,
      ]}
      forms={[
        {
          title: 'Internal info',
          object: 'person',
          blocks: [
            [
              {
                text: 'Status',
                field: 'person.status',
                optional: true,
              },
              {
                text: 'Location preferences',
                field: 'person.locationpreferences',
                optional: true,
              },
              {
                text: 'Interview date',
                field: 'person.interviewdate',
                optional: true,
              },
              {
                text: 'Notes',
                field: 'person.notes',
                rows: 3,
                optional: true,
              },
            ],
          ],
        },
        {
          title: 'Application',
          object: 'person',
          blocks: applyBlocks(true),
        },
      ]}
    />
  </div>
));

const Dashboard = compose(auth, withRouter('dashboard'))(({ breadcrumbs }) => (
  <Div style={{ spacing: 15 }}>
    <Breadcrumbs
      breadcrumbs={breadcrumbs}
      style={{
        ...styles.base,
        fontWeight: 'bold',
        fontStyle: 'italic',
        link: {
          color: colors.purple,
          hover: { color: colors.purpleDark },
        },
      }}
    />
    <Content />
  </Div>
));

export default () => (
  <>
    <Helmet title="Dashboard | Worthwhile">
      <style>{`
      html {
        background: white !important;
      }
      `}</style>
    </Helmet>
    <Dashboard />
  </>
);
