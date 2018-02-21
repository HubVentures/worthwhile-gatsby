import * as React from 'react';
import { enclose } from 'mishmash';
import { Input } from 'elmnt';

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
})(({ value, onChange, inputRef, onBlur, style }) => (
  <div>
    <Input
      type="string"
      value={value}
      onChange={onChange}
      style={{
        ...style,
        marginTop: -style.borderTopWidth,
        marginRight: -style.borderRightWidth,
        marginBottom: -style.borderBottomWidth,
        marginLeft: -style.borderLeftWidth,
      }}
      spellCheck={false}
      rows={0}
    />
    <Input
      type="string"
      value={value}
      onChange={onChange}
      style={{
        ...style,
        position: 'absolute',
        top: -style.borderTopWidth,
        right: -style.borderRightWidth,
        bottom: -style.borderBottomWidth,
        left: -style.borderLeftWidth,
      }}
      spellCheck={false}
      rows={0}
      onBlur={onBlur}
      ref={inputRef}
    />
  </div>
));
