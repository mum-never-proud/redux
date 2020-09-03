(/* istanbul ignore next */function redux(factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  // eslint-disable-next-line no-undef
  } else if (typeof define === 'function' && define.amd) {
    // eslint-disable-next-line no-undef
    define('$R', factory);
  } else {
    window.$R = factory();
  }
}(() => {
  const $R = {};

  $R.createStore = (reducer, state = {}) => {
    if (typeof reducer !== 'function') {
      throw Error('reducer must be a function');
    }

    const store = {
      listeners: [],
      state: Object.freeze(state),
      getState: () => store.state,
      subscribe: (listener) => {
        if (typeof listener === 'function') {
          return store.listeners.push(listener);
        }
        throw Error('listener must be a function');
      },
      dispatch: (action) => {
        store.state = Object.freeze(reducer(store.state, action));
        store.listeners.forEach((listener) => listener(store.state));
      },
    };

    store.dispatch({});

    return store;
  };

  $R.combineReducers = (reducers) => (state, action) => {
    const nextState = {}; const
      reducerNames = Object.keys(reducers);

    reducerNames.forEach((reducerName) => {
      nextState[reducerName] = reducers[reducerName](state[reducerName], action);
    });

    return nextState;
  };

  return $R;
}));
