export default () => {
  const values = {};
  const listeners = {};
  const set = (key, value?) => {
    if (value !== values[key]) {
      if (value === undefined) delete values[key];
      else values[key] = value;
      listeners[''] && listeners[''].forEach(l => l(values));
      listeners[key] && listeners[key].forEach(l => l(value));
    }
  };
  const listen = (key, listener) => {
    listener(key ? values[key] : values);
    listeners[key] = listeners[key] || [];
    listeners[key].push(listener);
    return () => listeners[key].splice(listeners[key].indexOf(listener), 1);
  };
  return {
    get: key => values[key],
    set,
    update: (key, map: (v) => any) => set(key, map(values[key])),
    listen,
    watch: (key, listener, onProps, initialProps) => {
      const getKey = props => (typeof key === 'string' ? key : key(props));
      let currentKey = getKey(initialProps);
      let unlisten = listen(currentKey, listener);
      onProps(props => {
        const newKey = props && getKey(props);
        if (newKey !== currentKey) {
          unlisten();
          currentKey = newKey;
          if (currentKey) unlisten = listen(currentKey, listener);
        }
      });
    },
  };
};
