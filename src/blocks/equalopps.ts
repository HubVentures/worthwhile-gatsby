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

export default (admin?: boolean) => [
  [
    ...(!admin
      ? [
          {
            title: '5. Equal Opportunities',
            info:
              'We are committed to equal opportunities in our recruitment process. In order to find out how well we are doing with this we need to collect monitoring data. The information we collect here is very useful to us as it helps us to become a more inclusive organisation. The information you supply on this form will be kept confidentially and will be analysed only on an anonymised basis. Please also note that the monitoring form will not be used to judge your application. If you have any questions please get in touch.',
          },
        ]
      : []),
    {
      text: 'What is your gender identity?',
      field: 'opps.gender',
      optional: admin,
    },
    {
      text: 'What is your sexual orientation?',
      field: 'opps.orientation',
      optional: admin,
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
      optional: admin,
    },
    {
      text: 'Do you have any dependents?',
      prompt: '(e.g. you care for someone or have children)',
      field: 'opps.dependents',
      optional: admin,
    },
    {
      text: 'Do you consider yourself to have a disability?',
      field: 'opps.disability',
      optional: admin,
    },
    {
      text: 'What was your home postcode when you were 16?',
      field: 'opps.homepostcode',
      style: { maxWidth: 200 },
      optional: admin,
    },
    {
      text: 'What is your annual household income?',
      prompt: '(before taxes)',
      field: 'opps.householdincome',
      optional: admin,
      style: { layout: 'stack' },
    },
    ...(!admin
      ? [
          {
            info: `Your household income is made up of your income plus the income of:
- your parents, if you’re under 25 and live with them or depend on them financially
- one of your parents and their partner, if you’re under 25 and live with them or depend on them financially
- your partner if relevant, if you’re over 25`,
          },
        ]
      : []),
  ],
];
