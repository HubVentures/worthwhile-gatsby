export const colors = {
  blue: '#0075b2',
  blueDark: '#006499',
  blueFaint: '#e5f6ff',

  red: 'red',
  redDark: '#b30000',
  redFaint: '#ffebeb',
  redExtraFaint: '#fffcfc',

  white: '#fff',
  black: '#333',

  processing: 'rgba(255,255,255,.4)',
};

export const icons = {
  fb: {
    viewBox: '0 0 1024 1024',
    path:
      'M928 0h-832c-52.8 0-96 43.2-96 96v832c0 52.8 43.2 96 96 96h416v-448h-128v-128h128v-64c0-105.8 86.2-192 192-192h128v128h-128c-35.2 0-64 28.8-64 64v64h192l-32 128h-160v448h288c52.8 0 96-43.2 96-96v-832c0-52.8-43.2-96-96-96z',
  },
  fbThin: {
    viewBox: '0 0 448 832',
    path:
      'm128,832l0,-448l-128,0l0,-128l128,0l0,-64c0,-105.8 86.2,-192 192,-192l128,0l0,128l-128,0c-35.2,0 -64,28.8 -64,64l0,64l192,0l-32,128l-160,0l0,448l-128,0z',
  },
  twitter: {
    viewBox: '0 0 1024 1024',
    path:
      'M1024 226.4c-37.6 16.8-78.2 28-120.6 33 43.4-26 76.6-67.2 92.4-116.2-40.6 24-85.6 41.6-133.4 51-38.4-40.8-93-66.2-153.4-66.2-116 0-210 94-210 210 0 16.4 1.8 32.4 5.4 47.8-174.6-8.8-329.4-92.4-433-219.6-18 31-28.4 67.2-28.4 105.6 0 72.8 37 137.2 93.4 174.8-34.4-1-66.8-10.6-95.2-26.2 0 0.8 0 1.8 0 2.6 0 101.8 72.4 186.8 168.6 206-17.6 4.8-36.2 7.4-55.4 7.4-13.6 0-26.6-1.4-39.6-3.8 26.8 83.4 104.4 144.2 196.2 146-72 56.4-162.4 90-261 90-17 0-33.6-1-50.2-3 93.2 59.8 203.6 94.4 322.2 94.4 386.4 0 597.8-320.2 597.8-597.8 0-9.2-0.2-18.2-0.6-27.2 41-29.4 76.6-66.4 104.8-108.6z',
  },
  up: {
    viewBox: '0 0 320 512',
    path:
      'M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z',
  },
  down: {
    viewBox: '0 0 320 512',
    path:
      'M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z',
  },
  updown: {
    viewBox: '0 0 320 512',
    path:
      'M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z',
  },
  error: {
    viewBox: '0 0 16 16',
    path:
      'M8.865 1.52c-.18-.31-.51-.5-.87-.5s-.69.19-.87.5L.275 13.5c-.18.31-.18.69 0 1 .19.31.52.5.87.5h13.7c.36 0 .69-.19.86-.5.17-.31.18-.69.01-1L8.865 1.52zM8.995 13h-2v-2h2v2zm0-3h-2V6h2v4z',
  },
  plus: {
    viewBox: '0 0 448 512',
    path:
      'M448 294.2v-76.4c0-13.3-10.7-24-24-24H286.2V56c0-13.3-10.7-24-24-24h-76.4c-13.3 0-24 10.7-24 24v137.8H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h137.8V456c0 13.3 10.7 24 24 24h76.4c13.3 0 24-10.7 24-24V318.2H424c13.3 0 24-10.7 24-24z',
  },
  cross: {
    viewBox: '0 0 384 512',
    path:
      'M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z',
  },
  filter: {
    viewBox: '0 0 512 512',
    path:
      'M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z',
  },
};

const textStyle = {
  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 16,
  color: colors.black,
};

const buttonStyle = isHovered => ({
  ...textStyle,
  fontSize: 28,
  textAlign: 'center',
  color: colors.white,
  fontWeight: 'bold' as 'bold',
  padding: 16,
  margin: '0 auto',
  width: 180,
  letterSpacing: 0.5,
  userSelect: 'none',
  cursor: 'pointer',
  borderRadius: 3,
  background: isHovered ? colors.blueDark : colors.blue,
});

const fieldStyle = {
  ...textStyle,

  padding: 8,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: '#888',
  borderRadius: 3,
  boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.15)',
  background: colors.white,
  spacing: '10px 25px',

  placeholder: {
    color: 'rgba(0,0,0,0.35)',
  },
  selected: {
    fontWeight: 'bold' as 'bold',
  },
  group: {
    fontWeight: 'bold' as 'bold',
    fontStyle: 'italic' as 'italic',
  },
  column: {
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '8px 15px',
  },
  key: {
    fontStyle: 'italic' as 'italic',
    fontSize: 14,
    width: 400,
  },
  alt: {
    row: { background: 'rgba(0, 0, 0, 0.03)' },
  },
  none: {
    fontStyle: 'italic' as 'italic',
  },

  focus: {
    borderColor: colors.blue,
    active: {
      background: colors.blueFaint,
    },
  },

  invalid: {
    background: colors.redExtraFaint,
    borderColor: colors.red,
    focus: {
      borderColor: colors.redDark,
      active: {
        background: colors.redFaint,
      },
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
    focus: {
      backgroundColor: colors.blueFaint,
    },
  },

  button: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: 'bold' as 'bold',
    letterSpacing: 0.5,
    width: 120,
    boxShadow: 'none',
    background: colors.blue,
    hover: { background: colors.blueDark },
    focus: {
      active: {
        background: colors.blue,
        hover: { background: colors.blueDark },
      },
    },
  },
};

export default {
  text: textStyle,
  title: {
    ...textStyle,
    fontSize: 30,
    fontWeight: 'bold' as 'bold',
    color: colors.blue,
  },
  markdown: {
    ...textStyle,
    link: { color: colors.blue },
    hr: { background: colors.blue },
    heading: { color: colors.blue },
  },
  button: buttonStyle,
  field: fieldStyle,
  // tableLinks: {
  //   ...baseStyle,
  //   fontSize: 13,
  //   verticalAlign: 'middle',
  //   borderRadius: 3,
  //   spinner: { color: colors.purple },
  //   header: {
  //     heading: { fontSize: 30 },
  //     link: {
  //       color: colors.purple,
  //       hover: { color: colors.purpleDark },
  //     },
  //     hr: { background: colors.purple },
  //   },
  //   column: {
  //     fontWeight: 'bold',
  //     background: '#e0e0e0',
  //     padding: '10px 20px 9px 10px',
  //   },
  //   link: {
  //     color: colors.purple,
  //     padding: `8px 20px 8px 10px`,
  //     alt: { background: '#f9f9f9' },
  //     index: {
  //       fontWeight: 'bold',
  //       color: colors.black,
  //       width: 50,
  //     },
  //     hover: {
  //       color: 'white',
  //       background: colors.purple,
  //       alt: { background: colors.purple },
  //       index: { color: 'white' },
  //     },
  //   },
  //   filter: {
  //     fontSize: 14,
  //     label: {
  //       fontWeight: 'bold',
  //       fontStyle: 'italic',
  //       width: 50,
  //     },
  //     helpLabel: {
  //       fontWeight: 'bold',
  //       width: 75,
  //       color: colors.purple,
  //       hover: { color: colors.purpleDark },
  //     },
  //     field: {
  //       ...fieldStyle('purple', true),
  //       fontSize: 14,
  //       padding: 8,
  //     },
  //     help: {
  //       fontSize: 16,
  //       title: { fontWeight: 'bold', fontSize: 30 },
  //       subtitle: { fontWeight: 'bold', fontSize: 20 },
  //       text: { fontWeight: 'bold' },
  //       indent: { fontStyle: 'italic', color: colors.purple },
  //       note: { opacity: 0.7, fontStyle: 'italic' },
  //       op: { fontWeight: 'bold', fontStyle: 'italic' },
  //       fields: { fontSize: 13 },
  //     },
  //   },
  // },
};
