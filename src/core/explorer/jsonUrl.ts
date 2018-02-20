const encode = s => {
  return !/[^\w-.]/.test(s)
    ? s
    : s.replace(/[^\w-.]/g, ch => {
        if (ch === '$') return '!';
        ch = ch.charCodeAt(0);
        return ch < 0x100
          ? '*' + ('00' + ch.toString(16)).slice(-2)
          : '**' + ('0000' + ch.toString(16)).slice(-4);
      });
};

const stringify = v => {
  let tmpAry;

  switch (typeof v) {
    case 'number':
      return isFinite(v) ? '~' + v : '~null';
    case 'boolean':
      return '~' + v;
    case 'string':
      return '~"' + encode(v);
    case 'object':
      if (!v) return '~null';

      tmpAry = [];

      if (Array.isArray(v)) {
        for (let i = 0; i < v.length; i++) {
          tmpAry[i] = stringify(v[i]) || '~null';
        }

        return '~(' + (tmpAry.join('') || '~') + ')';
      } else {
        for (const key in v) {
          if (v.hasOwnProperty(key)) {
            const val = stringify(v[key]);

            // skip undefined and functions
            if (val) {
              tmpAry.push(encode(key) + val);
            }
          }
        }

        return '~(' + tmpAry.join('~') + ')';
      }
    default:
      // function, undefined
      return;
  }
};

const reserved = {
  true: true,
  false: false,
  null: null,
};

const baseParse = s => {
  if (!s) return s;
  s = s.replace(/%(25)*22/g, '"');
  let i = 0,
    len = s.length;

  const eat = expected => {
    if (s.charAt(i) !== expected)
      throw new Error(
        'bad JSURL syntax: expected ' +
          expected +
          ', got ' +
          (s && s.charAt(i)),
      );
    i++;
  };

  const decode = () => {
    let beg = i,
      ch,
      r = '';
    while (i < len && (ch = s.charAt(i)) !== '~' && ch !== ')') {
      switch (ch) {
        case '*':
          if (beg < i) r += s.substring(beg, i);
          if (s.charAt(i + 1) === '*')
            (r += String.fromCharCode(parseInt(s.substring(i + 2, i + 6), 16))),
              (beg = i += 6);
          else
            (r += String.fromCharCode(parseInt(s.substring(i + 1, i + 3), 16))),
              (beg = i += 3);
          break;
        case '!':
          if (beg < i) r += s.substring(beg, i);
          (r += '$'), (beg = ++i);
          break;
        default:
          i++;
      }
    }
    return r + s.substring(beg, i);
  };

  const parseOne = () => {
    let result, ch, beg;
    eat('~');
    switch ((ch = s.charAt(i))) {
      case '(':
        i++;
        if (s.charAt(i) === '~') {
          result = [];
          if (s.charAt(i + 1) === ')') i++;
          else {
            do {
              result.push(parseOne());
            } while (s.charAt(i) === '~');
          }
        } else {
          result = {};
          if (s.charAt(i) !== ')') {
            do {
              const key = decode();
              result[key] = parseOne();
            } while (s.charAt(i) === '~' && ++i);
          }
        }
        eat(')');
        break;
      case '"':
        i++;
        result = decode();
        break;
      default:
        beg = i++;
        while (i < len && /[^)~]/.test(s.charAt(i))) i++;
        const sub = s.substring(beg, i);
        if (/[\d\-]/.test(ch)) {
          result = parseFloat(sub);
        } else {
          result = reserved[sub];
          if (typeof result === 'undefined')
            throw new Error('bad value keyword: ' + sub);
        }
    }
    return result;
  };
  return parseOne();
};

const parse = s => {
  try {
    return baseParse(s);
  } catch (ex) {
    return null;
  }
};

export default { stringify, parse };
