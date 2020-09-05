const $R = require('../src/redux');

const emptyState = () => ({});
const state = () => ({ counter: 0 });

describe('redux test', () => {
  it('should throw error when reducer is not a function', () => {
    expect(() => { $R.createStore(); }).toThrow(Error);
  });

  it('should not allow mutating the state', () => {
    const store = $R.createStore(emptyState, {});
    store.state.dummyField = 'dummy';

    expect(store.state).toEqual({});
  });

  it('should get the current state on calling fx::getState', () => {
    const store = $R.createStore(state);

    expect(store.getState()).toEqual({ counter: 0 });
  });

  it('should add listeners on calling fx::subscribe', () => {
    const store = $R.createStore(emptyState);
    store.subscribe(emptyState);

    expect(store.listeners.length).toEqual(1);
  });

  it('should throw error when subscriber is not a function', () => {
    const store = $R.createStore(emptyState);

    expect(() => store.subscribe()).toThrow(Error);
  });

  it('should update the state on calling fx:dispatch', () => {
    const reducerFx = jest.fn(); const store = $R.createStore(reducerFx); const
      subscribeFx = jest.fn();

    store.subscribe(subscribeFx);
    store.dispatch({});

    expect(reducerFx).toBeCalled();
    expect(subscribeFx).toBeCalled();
  });

  it('should call all the reducer functions on dispatch', () => {
    const reducerFx1 = jest.fn();
    const reducerFx2 = jest.fn();
    const subscribeFx = jest.fn();
    const store = $R.createStore($R.combineReducers({
      reducerFx1,
      reducerFx2,
    }));

    store.subscribe(subscribeFx);
    store.dispatch({});

    expect(reducerFx1).toBeCalled();
    expect(reducerFx2).toBeCalled();
    expect(subscribeFx).toBeCalled();
  });
});
