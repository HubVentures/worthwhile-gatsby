export const initialQuery = [
  {
    name: 'ww_people',
    filter: ['firstname', 'Jon'],
    sort: ['firstname', '-lastname'],
    start: 0,
    end: 9,
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
      'email',
      {
        name: 'equalopps',
        fields: ['gender'],
      },
      'lastname',
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
            { firstname: 'William', lastname: 'Smith' },
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
    {
      firstname: 'Dave',
      lastname: 'Smith',
      test: [
        {
          gender: 'Male',
          person: [
            { firstname: 'Dave', lastname: 'Smith' },
            { firstname: 'William', lastname: 'Smith' },
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
    {
      firstname: 'Dave',
      lastname: 'Smith',
      test: [
        {
          gender: 'Male',
          person: [
            { firstname: 'Dave', lastname: 'Smith' },
            { firstname: 'William', lastname: 'Smith' },
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
    {
      firstname: 'Dave',
      lastname: 'Smith',
      test: [
        {
          gender: 'Male',
          person: [
            { firstname: 'Dave', lastname: 'Smith' },
            { firstname: 'William', lastname: 'Smith' },
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
    {
      firstname: 'Dave',
      lastname: 'Smith',
      test: [
        {
          gender: 'Male',
          person: [
            { firstname: 'Dave', lastname: 'Smith' },
            { firstname: 'William', lastname: 'Smith' },
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
    {
      firstname: 'Dave',
      lastname: 'Smith',
      test: [
        {
          gender: 'Male',
          person: [
            { firstname: 'Dave', lastname: 'Smith' },
            { firstname: 'William', lastname: 'Smith' },
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
  ],
  ww_equalopps: [],
};
