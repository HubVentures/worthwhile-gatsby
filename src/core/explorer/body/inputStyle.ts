import { colors } from '../../styles';

export default {
  position: 'relative' as 'relative',
  zIndex: 200,
  maxWidth: 401,

  fontFamily: 'Ubuntu, sans-serif',
  fontSize: 12,
  lineHeight: '18px',
  color: colors.black,
  boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.15)',
  padding: 10,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '#ccc',
  background: 'white',
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
  none: {
    fontStyle: 'italic' as 'italic',
  },

  focus: {
    borderColor: colors.blue,
    zIndex: 201,
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
