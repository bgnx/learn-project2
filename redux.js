let createStore = (reducerFn, initialState) => {
  let state = initialState;
  let subs = [];
  return {
    subscribe: (fn) => {
      subs.push(fn);
      return () => {
        subs.splice(subs.indexOf(fn), 1)
      }
    },
    dispatch: (action) => {
      let newState = reducerFn(state, action);
      if (newState !== state) {
        state = newState;
        subs.forEach(sub => {
          sub();
        })
      }
    },
    getState: () => {
      return state;
    }
  }
}

function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

let store = createStore(counter, 0)

let unSub = store.subscribe(() => console.log(store.getState()))
setTimeout(() => {
  unSub();
}, 5000);

setInterval(() => {
  store.dispatch({ type: 'INCREMENT' });
}, 1000);
