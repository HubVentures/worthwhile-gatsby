import * as React from 'react';
import { Icon } from 'elmnt';
import { enclose, methodWrap } from 'mishmash';

import { colors, icons } from '../styles';

export default enclose(() => {
  const methods = methodWrap();
  return ({ path, ...props }) => ({
    ...props,
    ...methods({
      onMouseMove: () => props.setActive({ type: 'remove', path }),
      onMouseLeave: () => props.setActive(null),
      onClick: () => {
        props.clickRemove(path);
        props.setActive(null);
      },
    }),
  });
})(({ relation, active, onMouseMove, onMouseLeave, onClick }) => (
  <>
    {active && (
      <Icon
        {...icons.cross}
        style={{
          fontSize: 7,
          background: colors.red,
          color: 'white',
          borderRadius: 10,
          padding: 2,
          position: 'absolute',
          left: '50%',
          marginLeft: -6,
          ...(relation ? { top: -4 } : { bottom: -4 }),
        }}
      />
    )}
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onDoubleClick={onClick}
      style={{
        position: 'absolute',
        top: relation ? -11 : 0,
        left: relation ? -11 : 0,
        bottom: relation ? -11 : -11,
        right: relation ? -11 : 0,
        cursor: 'pointer',
        // background: 'rgba(0,0,255,0.1)',
      }}
    />
  </>
));
