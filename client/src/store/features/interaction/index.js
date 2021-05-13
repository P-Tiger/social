import { createSlice } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  interactionsList,
  interactionsDetail,
  interactionsPut,
  interactionsPutStatus,
  interactionsPost
} from '../../../data'
import Swal from 'sweetalert2'
import _ from 'lodash';
import validate from 'objectid'
const initialState = {
  // all properties in this state would be passed to the
  // reducer for the first time when Redux initializes
  interactionsData: [],
  interactionsDataDetail: {}
};

const interactionsSlice = createSlice({
  name: 'interactions',
  initialState,
  reducers: {
    request: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        interactionsData: []
      }
    },
    requestPost: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state
      }
    },

    requestDetail: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        interactionsDataDetail: {}
      }
    },
    requestUpdate: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        interactionsDataDetail: {}
      }
    },
    requestUpdateStatus: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        interactionsDataDetail: {}
      }
    },
    success: (state, action) => {
      return {
        ...state,
        interactionsData: action.payload.data,
      }
    },
    successDetail: (state, action) => {
      return {
        ...state,
        interactionsDataDetail: action.payload,
      }
    },
    after: (state, action) => {
      return {
        ...state,
        interactionsData: action.payload
      }
    },
    afterStatus: (state, action) => {
      let filterData = state.interactionsData.filter(x => x._id != action.payload._id)
      console.log(filterData)
      return {
        ...state,
        interactionsData: [...filterData]
      }
    },
    failureDetail: (state) => {
      return {
        ...state,
        interactionsDataDetail: {}
      }
    },
    failure: (state) => {
      return {
        ...state,
        interactionsData: []
      }
    },
    clear: (state) => {
      return {
        ...state,
        interactionsData: []
      }
    },
    clearDetail: (state) => {
      return {
        ...state,
        interactionsDataDetail: {}
      }
    },
  },
});

export const interactionsReducer = interactionsSlice.reducer;
export const { request, clear, after, requestDetail, clearDetail, requestUpdate, requestUpdateStatus, requestPost } = interactionsSlice.actions;

function* interactionsHandler(action) {
  try {
    let response = yield call(interactionsList, action.payload)
    yield put({ type: "interactions/success", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
    yield put({ type: "interactions/failure" })
  }
  // perform side effects here
}

function* interactionsHandlerCreate(action) {
  try {
    let {
      post_ids,
      perPage,
      comment,
      post_id
    } = action.payload
    yield call(interactionsPost, { comment: comment, post_id: post_id })
    let response = yield call(interactionsList, { post_ids: JSON.stringify(post_ids) })
    yield put({ type: "interactions/success", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
  }
}

function* interactionsHandlerStatus(action) {
  try {
    let response = yield call(interactionsPutStatus, action.payload)
    yield put({ type: "interactions/afterStatus", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
  }
}

// The function below is called a saga and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(barSaga(10))`. This
// will call the async incrementHandler with the `action` as the first argument.
// Async code can then be executed and other actions can be dispatched with yield method.
export function* interactionsSaga() {
  // barSaga would listen to incrementByAmount action and call incrementHandler()
  yield takeLatest(request, interactionsHandler);
  yield takeLatest(requestPost, interactionsHandlerCreate);
  // yield takeLatest(requestDetail, interactionsHandlerDetail);
  // yield takeLatest(requestUpdate, interactionsHandlerUpdate);
  yield takeLatest(requestUpdateStatus, interactionsHandlerStatus);
  // yield takeLatest(requestPost, interactionsHandlerPost);
}
