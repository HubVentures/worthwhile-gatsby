import * as React from 'react';
import { enclose } from 'mishmash';
import { Input } from 'elmnt';

import inputStyle from './inputStyle';

export default enclose(({ initialProps, onProps, setState }) => {
  initialProps.store.watch(
    'editing',
    (editing = {}) => setState({ editing }),
    onProps,
  );
  const onChange = value =>
    initialProps.store.update('editing', v => ({ ...v, value }));
  let lastValue = initialProps.store.get('editing').value;
  return (props, { editing }) => ({
    ...props,
    value:
      Object.keys(editing).length > 0 ? (lastValue = editing.value) : lastValue,
    onChange,
  });
})(({ value, onChange, inputRef, onBlur }) => (
  <div>
    <Input
      type="string"
      value={value}
      onChange={onChange}
      style={{ ...inputStyle, margin: -1 }}
      spellCheck={false}
      rows={0}
    />
    <Input
      type="string"
      value={value}
      onChange={onChange}
      style={{
        ...inputStyle,
        position: 'absolute',
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
      }}
      spellCheck={false}
      rows={0}
      onBlur={onBlur}
      ref={inputRef}
    />
  </div>
));
