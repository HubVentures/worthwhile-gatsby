import * as React from 'react';
import r, { branch } from 'refluent';
import { Mark } from 'elmnt';

import Form from '../Form';
import loadApp from '../loadApp';
import styles from '../styles';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const now = new Date();
const availabilityOptions = Array.from({ length: 18 }).map(
  (_, i) => new Date(Date.UTC(now.getFullYear(), now.getMonth() + i)),
);
const availabilityLabels = availabilityOptions.map(
  d =>
    `${months[d.getMonth()]} ${d
      .getFullYear()
      .toString()
      .slice(2)}`,
);

const ethnicities = [
  '~White',
  'English/Welsh/Scottish/Northern Irish/British',
  'Irish',
  'Gypsy or Irish Traveller',
  'Any other White background',
  '~Mixed/Multiple ethnic groups',
  'White and Black Caribbean',
  'White and Black African',
  'White and Asian',
  'Any other Mixed/Multiple ethnic background',
  '~Asian/Asian British',
  'Indian',
  'Pakistani',
  'Bangladeshi',
  'Chinese',
  'Any other Asian background',
  '~Black/ African/Caribbean/Black British',
  'African',
  'Caribbean',
  'Any other Black/African/Caribbean background',
  '~Other ethnic group',
  'Arab',
  'Any other ethnic group',
  '~Prefer not to say',
  'Prefer not to say',
];

loadApp(
  r
    .do((_, push) => ({
      complete: false,
      onSubmit: () => push({ complete: true }),
    }))
    .yield(
      branch('complete', () => (
        <Mark style={styles.markdown}>
          {`# Thank you for applying!

We screen all candidates once a month, so please expect to hear from us within the next couple of weeks.`}
        </Mark>
      )),
    )
    .yield(({ onSubmit }) => (
      <Form
        objects={{
          person: { type: 'ww_people', initial: { status: 'Applied' } },
          opps: { type: 'ww_equalopps', initial: { person: 'person' } },
        }}
        blocks={[
          [
            { title: '1. Personal Details' },
            {
              text: 'Name',
              fields: [
                { field: 'person.firstname', placeholder: 'First' },
                { field: 'person.lastname', placeholder: 'Last' },
              ],
              style: { layout: 'bar' },
            },
            {
              text: 'Email',
              field: 'person.email',
            },
            {
              text: 'Phone number',
              field: 'person.mobile',
              style: { maxWidth: 300 },
            },
          ],
          [
            {
              title: '2. Questions',
            },
            {
              info:
                'These questions will help us get a better understanding of your skills, experiences and why the Worthwhile Graduate Scheme is right for you. Please provide tangible examples of how your skills, knowledge and experience will support your ability to perform in a small social impact organisation.',
            },
            {
              text:
                'What has motivated you to apply for the Worthwhile Graduate Scheme? (150 words)',
              vertical: true,
              field: 'person.motivation',
              rows: 3,
            },
            {
              text:
                "Describe a personal achievement or experience you've had in the last two years that you are particularly proud of and how this has helped prepare you for working in an innovative, socially-impactful organisation: (150 words)",
              vertical: true,
              field: 'person.achievement',
              rows: 3,
            },
            {
              text:
                'Tell us about a challenging obstacle you have faced. How did you deal with it and what did you learn from the experience? (150 words)',
              vertical: true,
              field: 'person.challenge',
              rows: 3,
            },
          ],
          [
            { title: '3. Other Information' },
            {
              text: 'When are you available to start the scheme?',
              prompt:
                'Some of our host organisations may be ready and raring to start their placements with Worthwhile already.',
              vertical: true,
              field: 'person.availability',
              options: availabilityOptions,
              labels: availabilityLabels,
              style: { layout: 'modal', maxWidth: 300 },
            },
            {
              text:
                'Please select your top three role type preferences (you can find descriptions of these roles in the FAQs):',
              vertical: true,
              fields: [
                {
                  field: 'person.role1',
                  placeholder: 'First preference',
                  style: { layout: 'modal', maxWidth: 400 },
                },
                {
                  field: 'person.role2',
                  placeholder: 'Second preference',
                  style: { layout: 'modal', maxWidth: 400 },
                },
                {
                  field: 'person.role3',
                  placeholder: 'Third preference',
                  style: { layout: 'modal', maxWidth: 400 },
                },
              ],
            },
            {
              text:
                'If you prefer to be located in a specific city or region, please specify here (optional)',
              vertical: true,
              field: 'person.locationpreference',
              optional: true,
            },
            {
              text:
                'If you have any specific skills you would like to bring to a role, please include them here (optional, max 50 words)',
              vertical: true,
              field: 'person.skills',
              optional: true,
              rows: 2,
            },
            {
              text: 'Please upload your CV as a PDF file:',
              vertical: true,
              field: 'person.cv',
            },
            {
              text: 'How did you hear about the Worthwhile Graduate Scheme?',
              vertical: true,
              field: 'person.comms',
              rows: 2,
            },
          ],
          [
            {
              title: '4. Educational Attainment',
            },
            {
              info:
                'Please list your most recent educational achievement. If you are in your final year of University, please list your predicted degree grade.',
            },
            {
              text: 'Name of institution',
              field: 'person.institution',
            },
            {
              text: 'Type of qualification',
              fields: [
                { field: 'person.qualification' },
                {
                  field: 'person.qualificationother',
                  placeholder: 'Please specify',
                  showIf: ['person.qualification', 'Other'],
                },
              ],
            },
            {
              text: 'Subject(s) studied',
              field: 'person.subjects',
            },
            {
              text: 'Grade(s) attained',
              field: 'person.grades',
            },
            {
              text: 'Dates',
              connect: 'to',
              fields: [
                { field: 'person.startdate' },
                { field: 'person.enddate' },
              ],
              style: { layout: 'bar' },
            },
          ],
          [
            {
              title: '5. Equal Opportunities',
            },
            {
              info:
                'We are committed to equal opportunities in our recruitment process. In order to find out how well we are doing with this we need to collect monitoring data. The information we collect here is very useful to us as it helps us to become a more inclusive organisation. The information you supply on this form will be kept confidentially and will be analysed only on an anonymised basis. Please also note that the monitoring form will not be used to judge your application. If you have any questions please get in touch.',
            },
            {
              text: 'What is your gender identity?',
              field: 'opps.gender',
              style: { layout: 'stack' },
            },
            {
              text: 'What is your sexual orientation?',
              field: 'opps.orientation',
              style: { layout: 'stack' },
            },
            {
              text: 'What is your ethnic group?',
              prompt:
                '(one option that best describes your ethnic group or background)',
              fields: [
                {
                  field: 'opps.ethnicity',
                  labels: ethnicities,
                  options: ethnicities.filter(l => l[0] !== '~'),
                  style: { layout: 'modal' },
                },
                {
                  field: 'opps.ethnicityother',
                  placeholder: 'Please describe',
                  showIf: [
                    'opps.ethnicity',
                    'in',
                    [
                      'Any other White background',
                      'Any other Mixed/Multiple ethnic background',
                      'Any other Asian background',
                      'Any other Black/African/Caribbean background',
                      'Any other ethnic group',
                    ],
                  ],
                },
              ],
            },
            {
              text: 'Do you have any dependents?',
              prompt: '(e.g. you care for someone or have children)',
              field: 'opps.dependents',
            },
            {
              text: 'Do you consider yourself to have a disability?',
              field: 'opps.disability',
            },
            {
              text: 'What was your home postcode when you were 16?',
              field: 'opps.homepostcode',
              style: { maxWidth: 200 },
            },
            {
              text: 'What is your annual household income?',
              prompt: '(before taxes)',
              field: 'opps.householdincome',
              style: { layout: 'stack' },
            },
            {
              info: `Your household income is made up of your income plus the income of:
- your parents, if you’re under 25 and live with them or depend on them financially
- one of your parents and their partner, if you’re under 25 and live with them or depend on them financially
- your partner if relevant, if you’re over 25`,
            },
          ],
          [
            {
              title: '6. Declaration',
            },
            {
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
              title: '7. Personal Data',
            },
            {
              info: `**At Worthwhile, we are committed to protecting and respecting your personal data. We want you to understand exactly how we process your personal data and why we need this information.**

**Before applying to this activity, please confirm that you have read and understood our [Privacy Notice](http://www.worthwhile.org.uk/privacy-policy), and that you agree to your personal data being processed in the way that the notice sets out.**`,
            },
            {
              label:
                'I understand and agree that the personal information I am providing will be processed for the purpose(s) laid out in the Privacy Notice',
              name: 'gdpr',
              scalar: 'boolean',
            },
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
    )),
);
