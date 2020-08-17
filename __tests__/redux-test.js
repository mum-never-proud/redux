const $R = require('../src/redux');
const emptyState = function() { return {}; };
const state = function() { return { counter: 0 }; }

describe('redux test', function() {
  it('should throw error when reducer is not a function', function() {
    expect(function() { $R.createStore(); }).toThrow(Error);
  });

  it('should not allow mutating the state', function () {
    const store = $R.createStore(emptyState, {});
    store.state.dummyField = 'dummy';

    expect(store.state).toEqual({});
  });

  it('should get the current state on calling fx::getState', function() {
    const store = $R.createStore(state);

    expect(store.getState()).toEqual({ counter: 0 });
  });

  it('should add listeners on calling fx::subscribe', function() {
    const store = $R.createStore(emptyState);
    store.subscribe(emptyState);

    expect(store.listeners.length).toEqual(1);
  });

  it('should throw error when subscriber is not a function', function() {
    const store = $R.createStore(emptyState);

    expect(() => store.subscribe()).toThrow(Error);
  });

  it('should update the state on calling fx:dispatch', function() {
    const reducerFx = jest.fn(), store = $R.createStore(reducerFx), subscribeFx = jest.fn();

    store.subscribe(subscribeFx);
    store.dispatch({});

    expect(reducerFx).toBeCalled();
    expect(subscribeFx).toBeCalled();
  });

  it('should call all the reducer functions on dispatch', function() {
    const reducerFx1 = jest.fn(),
      reducerFx2 = jest.fn(),
      subscribeFx = jest.fn(),
      store = $R.createStore($R.combineReducers({
        reducerFx1,
        reducerFx2
      }));

      store.subscribe(subscribeFx);
      store.dispatch({});

      expect(reducerFx1).toBeCalled();
      expect(reducerFx2).toBeCalled();
      expect(subscribeFx).toBeCalled();
  });
});
