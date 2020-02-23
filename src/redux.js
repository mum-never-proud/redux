!(/* istanbul ignore next */ function(factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  }
  else if (typeof define === 'function' && define.amd) {
    define('$R', factory);
  }
  else {
    window['$R'] = factory();
  }
})(function() {
  const $R = {
    listeners: [],
    state: {}
  };
  let _reducer;

  $R.createStore = (state, reducer) => {
    if (!reducer) {
      throw Error('reducer must be a function');
    }

   $R.state = Object.freeze(state || $R.state);
    _reducer = reducer;

    return $R;
  };
  $R.getState = () => $R.state;
  $R.subscribe = listener => {
    if (typeof listener === 'function') {
      $R.listeners.push(listener);
      return $R;
    }
    throw Error('listener must be a function');
  };
  $R.dispatch = action => {
    $R.state = Object.freeze(_reducer($R.state, action));
    $R.listeners.forEach(listener => listener());

    return $R;
  };
  $R.combineReducers = reducers => {
    return (state, action) => {
      const nextState = {}, reducerNames = Object.keys(reducers);

      reducerNames.forEach(reducerName => nextState[reducerName] = reducers[reducerName](state[reducerName], action));

      return nextState;
    }
  };

  return $R;
});
