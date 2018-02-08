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
const availabilityOptions = Array.from({ length: 18 }).map((_, i) => {
  const date = new Date(now.getFullYear(), now.getMonth() + i);
  return `${months[date.getMonth()]} ${date
    .getFullYear()
    .toString()
    .slice(2)}`;
});

export default (admin?: boolean) => [
  [
    ...(!admin ? [{ title: '1. Personal Details' }] : []),
    {
      text: 'Name',
      fields: [
        { field: 'person.firstname', placeholder: 'First' },
        { field: 'person.lastname', placeholder: 'Last' },
      ],
      optional: admin,
      style: { layout: 'bar' },
    },
    {
      text: 'Email',
      field: 'person.email',
      optional: admin,
    },
    {
      text: 'Phone number',
      field: 'person.mobile',
      style: { maxWidth: 300 },
      optional: admin,
    },
  ],
  [
    ...(!admin
      ? [
          {
            title: '2. Questions',
            info:
              'These questions will help us get a better understanding of your skills, experiences and why the Worthwhile Graduate Scheme is right for you. Please provide tangible examples of how your skills, knowledge and experience will support your ability to perform in a small social impact organisation.',
          },
        ]
      : []),
    {
      text:
        'What has motivated you to apply for the Worthwhile Graduate Scheme? (150 words)',
      vertical: true,
      field: 'person.motivation',
      rows: 3,
      optional: admin,
    },
    {
      text:
        "Describe a personal achievement or experience you've had in the last two years that you are particularly proud of and how this has helped prepare you for working in an innovative, socially-impactful organisation: (150 words)",
      vertical: true,
      field: 'person.achievement',
      rows: 3,
      optional: admin,
    },
    {
      text:
        'Tell us about a challenging obstacle you have faced. How did you deal with it and what did you learn from the experience? (150 words)',
      vertical: true,
      field: 'person.challenge',
      rows: 3,
      optional: admin,
    },
  ],
  [
    ...(!admin ? [{ title: '3. Other Information' }] : []),
    {
      text: 'When are you available to start the scheme?',
      prompt:
        'Some of our host organisations may be ready and raring to start their placements with Worthwhile already.',
      vertical: true,
      field: 'person.availability',
      options: availabilityOptions,
      optional: admin,
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
      optional: admin,
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
      optional: admin,
    },
    {
      text: 'How did you hear about the Worthwhile Graduate Scheme?',
      vertical: true,
      field: 'person.commsopen',
      rows: 2,
      optional: admin,
    },
  ],
  [
    ...(!admin
      ? [
          {
            title: '4. Educational Attainment',
            info:
              'Please list your most recent educational achievement. If you are in your final year of University, please list your predicted degree grade.',
          },
        ]
      : []),
    {
      text: 'Name of institution',
      field: 'person.institution',
      optional: admin,
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
      optional: admin,
    },
    {
      text: 'Subject(s) studied',
      field: 'person.subjects',
      optional: admin,
    },
    {
      text: 'Grade(s) attained',
      field: 'person.grades',
      optional: admin,
    },
    {
      text: 'Dates',
      connect: 'to',
      fields: [{ field: 'person.startdate' }, { field: 'person.enddate' }],
      optional: admin,
      style: { layout: 'bar' },
    },
  ],
];
