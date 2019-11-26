const server = require('server');
const { get, post } = server.router;
const rs = require('redux-saga');
const createSagaMiddleware = rs.default;
const { call, put, takeEvery, takeLatest } = require('redux-saga/effects');
const { createStore, applyMiddleware } = require('redux');
const fetch = require('node-fetch');

const fetchCall = (url) => fetch(url)
  .then(response => response.json())

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchUser(action) {
   try {
      const data = yield call(fetchCall, action.url);
      yield put({type: "DATA_FETCH_SUCCEEDED", data: data});
   } catch (e) {
      yield put({type: "DATA_FETCH_FAILED", message: "Failed"});
   }
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
function* mySaga() {
  yield takeEvery("DATA_FETCH_REQUESTED", fetchUser);
}


// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// defining initial state of redux store
const initialState = {
  "userId": 0,
  "id": 0,
  "title": "a",
  "completed": true
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'DATA_FETCH_SUCCEEDED':
      return action.data
    default:
      return state
  }
}

// mount it on the Store
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

// then run the saga
sagaMiddleware.run(mySaga);

// // render the application

store.subscribe(() => console.log(store.getState()));
store.dispatch({ type: 'DATA_FETCH_REQUESTED', url: 'https://jsonplaceholder.typicode.com/todos/1' });
store.dispatch({ type: 'DATA_FETCH_REQUESTED', url: 'https://jsonplaceholder.typicode.com/todos/2' });