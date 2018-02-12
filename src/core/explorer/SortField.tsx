import * as React from 'react';
import { Icon } from 'elmnt';
import { enclose, methodWrap } from 'mishmash';

import { colors, icons } from '../styles';

export default enclose(() => ({ path, ...props }) => {
  const methods = methodWrap();
  return {
    ...props,
    ...methods({
      onMouseMove: () => props.setActive({ type: 'sort', path }),
      onMouseLeave: () => props.setActive(null),
    }),
  };
})(({ sort, active, onMouseMove, onMouseLeave }) => (
  <>
    {(sort || active) && (
      <Icon
        {...icons[sort === 'asc' ? 'up' : sort === 'desc' ? 'down' : 'updown']}
        style={{
          fontSize: sort ? 9 : 7,
          background: active ? colors.blue : '#888',
          color: 'white',
          borderRadius: 10,
          padding: sort ? 1 : 2,
          position: 'absolute',
          left: '50%',
          marginLeft: -6,
          top: -5,
        }}
      />
    )}
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        top: -11,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: 'pointer',
        // background: 'rgba(255,0,0,0.1)',
      }}
    />
  </>
));
