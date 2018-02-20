import * as React from 'react';
import { Icon } from 'elmnt';
import { enclose } from 'mishmash';

import { colors, icons } from '../../styles';

export default enclose(({ methods }) => ({ path, ...props }) => ({
  ...props,
  ...methods({
    onMouseMove: () => props.context.setActive({ type: 'sort', path }),
    onMouseLeave: () => props.context.setActive(null),
    onClick: () => props.context.query.sort(path),
  }),
}))(({ sort, active, activeSibling, onMouseMove, onMouseLeave, onClick }) => (
  <>
    {(sort || active) && (
      <Icon
        {...icons[sort === 'asc' ? 'up' : sort === 'desc' ? 'down' : '']}
        style={{
          fontSize: sort ? 9 : 7,
          background: active || activeSibling ? colors.blue : '#aaa',
          color: colors.white,
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
      onClick={onClick}
      style={{
        position: 'absolute',
        top: -5,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: 'pointer',
        // background: 'rgba(0,0,255,0.1)',
      }}
    />
  </>
));
