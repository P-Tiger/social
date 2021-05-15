import { createSlice } from '@reduxjs/toolkit';
import { call, fork, put, take, takeLatest } from 'redux-saga/effects';
import {
  postsList,
  postsDetail,
  postsPut,
  postsPutStatus,
  postsPost,
  interactionsList
} from '../../../data'
import Swal from 'sweetalert2'
import _ from 'lodash';
import validate from 'objectid'
import update from 'react-addons-update';
const initialState = {
  // all properties in this state would be passed to the
  // reducer for the first time when Redux initializes
  postsData: [],
  postsDataDetail: {}
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    request: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        postsData: []
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
    requestPager: (state) => {
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
        postsDataDetail: {}
      }
    },
    requestUpdate: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        postsDataDetail: {}
      }
    },
    requestUpdateStatus: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        postsDataDetail: {}
      }
    },
    success: (state, action) => {
      return {
        ...state,
        postsData: action.payload.data,
      }
    },
    successDetail: (state, action) => {
      return {
        ...state,
        postsDataDetail: action.payload,
      }
    },
    after: (state, action) => {
      return {
        ...state,
        postsData: action.payload.data
      }
    },
    afterStatus: (state, action) => {
      let filterData = state.postsData.filter(x => x._id != action.payload._id)
      return {
        ...state,
        postsData: [...filterData]
      }
    },
    afterCreate: (state, action) => {
      console.log(action.payload)
      return {
        ...state,
        postsData: [action.payload, ...state.postsData]
      }
    },
    afterUpdate: (state, action) => {
      let findDataIndex = state.postsData.findIndex(x => x._id == action.payload._id)
      let newData = update(state, {
        postsData: {
          [findDataIndex]: {
            title: { $set: action.payload.title },
            content: { $set: action.payload.content }
          }
        }
      })
      return newData;
    },
    failureDetail: (state) => {
      return {
        ...state,
        postsDataDetail: {}
      }
    },
    failure: (state) => {
      return {
        ...state,
        postsData: []
      }
    },
    clear: (state) => {
      return {
        ...state,
        postsData: []
      }
    },
    clearDetail: (state) => {
      return {
        ...state,
        postsDataDetail: {}
      }
    },
  },
});

export const postsReducer = postsSlice.reducer;
export const { request, clear, after, requestDetail, clearDetail, requestUpdate, requestUpdateStatus, requestPost, requestPager } = postsSlice.actions;

function* postsHandler(action) {
  try {
    let response = yield call(postsList, action.payload)
    yield put({ type: "posts/success", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
    yield put({ type: "posts/failure" })
  }
  // perform side effects here
}

function* postsHandlerDetail(action) {
  try {
    let response = yield call(postsDetail, action.payload)
    yield put({ type: "posts/successDetail", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
    yield put({ type: "posts/failureDetail" })
  }
  // perform side effects here
}



function* postsHandlerUpdate(action) {
  try {

    let response = yield call(postsPut, action.payload)
    yield put({ type: "posts/afterUpdate", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
    yield put({ type: "posts/failureDetail" })
  }
  // perform side effects here
}


function* postsHandlerUpdateStatus(action) {
  try {
    let response = yield call(postsPutStatus, action.payload)
    yield put({ type: "posts/afterStatus", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
  }
  // perform side effects here
}

function* postsHandlerPost(action) {
  try {
    let response = yield call(postsPost, action.payload)
    yield put({ type: "posts/afterCreate", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
  }
  // perform side effects here
}

function* postHandlerGetInteraction(action) {
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
}

function* postHandlePager(action) {
  try {
    let response = yield call(postsList, action.payload)
    yield put({ type: "posts/success", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
  }
  // perform side effects here
}

// The function below is called a saga and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(barSaga(10))`. This
// will call the async incrementHandler with the `action` as the first argument.
// Async code can then be executed and other actions can be dispatched with yield method.
export function* postsSaga() {
  // barSaga would listen to incrementByAmount action and call incrementHandler()
  yield takeLatest(request, postsHandler);
  yield takeLatest(requestUpdateStatus, postsHandlerUpdateStatus);
  yield takeLatest(requestUpdate, postsHandlerUpdate);
  yield takeLatest(requestPost, postsHandlerPost);
  yield takeLatest(requestPager, postHandlePager);
  while (true) {
    const { payload } = yield take("posts/success");
    let listIdPost = _.map(payload?.data || [], "_id")
    if (listIdPost.length > 0) {
      yield fork(postHandlerGetInteraction, { post_ids: listIdPost, page: 1, perPage: 5 })
    }
  }
  // yield takeLatest(requestDetail, postsHandlerDetail);
}
