import * as React from 'react';
import { branch, compose, enclose, render } from 'mishmash';
import { Div, Mark, Txt } from 'elmnt';
import Helmet from 'react-helmet';

import applyBlocks from '../blocks/apply';
import equaloppsBlocks from '../blocks/equalopps';
import Form from '../core/Form';
import styles, { colors } from '../core/styles';

import * as headerImg from '../img/header.png';

const ApplyForm = compose(
  enclose(({ setState }) => {
    setState({ complete: false });
    return (props, state) => ({
      ...props,
      ...state,
      onSubmit: () => setState({ complete: true }),
    });
  }),
  branch(
    ({ complete }) => complete,
    render(() => (
      <Mark style={styles.markdown}>
        {`# Thank you for applying!

We screen all candidates once a month, so please expect to hear from us within the next couple of weeks.`}
      </Mark>
    )),
  ),
)(({ onSubmit }) => (
  <Form
    objects={{
      person: { type: 'ww_people', initial: { status: 'Applied' } },
      opps: { type: 'ww_equalopps', initial: { person: 'person' } },
    }}
    blocks={[
      ...applyBlocks(false),
      ...equaloppsBlocks(false),
      [
        {
          title: '6. Declaration',
          info: '**By submitting this application:**',
        },
        {
          label:
            'I confirm that the information in this application is true and accurate, to the best of my knowledge',
          name: 'accurate',
          scalar: 'boolean',
        },
        {
          label:
            'I confirm that I understand that any false statement may disqualify me from appointment',
          name: 'disqualify',
          scalar: 'boolean',
        },
        {
          label:
            'I confirm that I am eligible to work in the UK. (unfortunately we are not able to sponsor visas for non-EU students)',
          name: 'eligible',
          scalar: 'boolean',
        },
      ],
      [
        {
          text:
            'Are you happy to give your consent for Worthwhile to share your CV (including your name and contact details) with organisations hiring for roles that align with your interests?',
          vertical: true,
          field: 'person.cvconsent',
        },
      ],
    ]}
    onSubmit={onSubmit}
  />
));

export default () => (
  <>
    <Helmet title="Apply | Worthwhile" />
    <div>
      <div
        style={{
          backgroundImage: `url("${headerImg}")`,
          backgroundSize: 'cover',
        }}
      >
        <div
          style={{
            background:
              'linear-gradient(to right,rgba(0,117,176,0.8) 0%,rgba(0,174,239,0.8) 100%)',
            padding: '50px 0',
          }}
        >
          <Txt
            style={{
              ...styles.title,
              color: colors.white,
              textAlign: 'center',
              fontSize: 50,
            }}
          >
            Apply to Worthwhile
          </Txt>
        </div>
      </div>
      <Div
        style={{
          spacing: 25,
          padding: '50px 15px',
          margin: '0 auto',
          maxWidth: 700,
        }}
      >
        <Mark style={{ ...styles.markdown }}>
          {`Thank you for choosing to apply for the Worthwhile Graduate Scheme. All information collected on this application form is treated confidentially and used for recruitment and selection purposes only. We regret that, due to the high number of applications we receive for the Graduate Scheme, we cannot provide feedback to candidates whose application is unsuccessful.`}
        </Mark>
        <div
          style={{
            background: '#888',
            height: 4,
            borderRadius: 10,
            margin: '20px 0',
          }}
        />
        <ApplyForm />
      </Div>
    </div>
  </>
);
