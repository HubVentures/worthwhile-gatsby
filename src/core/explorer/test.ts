export const initialQuery = [
  {
    name: 'ww_people',
    sort: ['firstname', '-lastname'],
    fields: [
      'firstname',
      'lastname',
      {
        name: 'equalopps',
        alias: 'test',
        fields: [
          'gender',
          { name: 'person', fields: ['firstname', 'lastname'] },
          'disability',
        ],
      },
      'lastname',
      {
        name: 'equalopps',
        fields: ['gender'],
      },
      'email',
    ],
  },
  {
    name: 'ww_equalopps',
    fields: ['gender'],
  },
];

export const data = {
  ww_people: [
    {
      firstname: 'Dave',
      lastname: 'Smith',
      test: [
        {
          gender: 'Male',
          person: [
            { firstname: 'Dave', lastname: 'Smith' },
            // { firstname: 'William', lastname: 'Smith' },
          ],
          disability: false,
        },
        {
          gender: 'Female',
          person: { firstname: 'Dave', lastname: 'Smith' },
          disability: true,
        },
      ],
      equalopps: [{ gender: 'Male' }, { gender: 'Male' }, { gender: 'Male' }],
      email: 'dave.smith@gmail.com',
    },
    null,
    {
      firstname: 'Susan',
      lastname: 'Jones',
      test: [
        {
          gender: 'Female',
          person: { firstname: 'Susan', lastname: 'Jones' },
          disability: false,
        },
      ],
      equalopps: [],
      email: 'susan.jones@gmail.com',
    },
  ],
  ww_equalopps: [],
};
