import { createSlice } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  postsList,
  postsDetail,
  postsPut,
  postsPutStatus,
  postsPost
} from '../../../data'
import Swal from 'sweetalert2'
import _ from 'lodash';
import validate from 'objectid'
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
        postsData: action.payload,
      }
    },
    successDetail: (state, action) => {
      return {
        ...state,
        postsDataDetail: action.payload,
      }
    },
    after: (state, action) => {
      console.log(action.payload)
      return {
        ...state,
        postsData: action.payload
      }
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
export const { request, clear, after, requestDetail, clearDetail, requestUpdate, requestUpdateStatus, requestPost } = postsSlice.actions;

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


function* postsHandlerUpdateStatus(action) {
  try {
    let {
      id,
      page
    } = action.payload
    let response = yield call(postsPutStatus, { id: id })
    yield put({ type: "posts/successDetail", payload: response.data })
    let splitData = _.split(window.location.href, "#");
    let id_department = splitData[splitData.length - 1]
    if (validate.isValid(id_department)) {
      let responseList = yield call(postsList, { department: id_department, page: page, perPage: 10 })
      yield put({ type: "posts/success", payload: responseList.data })
    } else {
      let responseList = yield call(postsList, { page: page, perPage: 10 })
      yield put({ type: "posts/success", payload: responseList.data })
    }

    Swal.fire("Xoá thành công")
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

function* postsHandlerPost(action) {
  try {
    let {
      department,
      title,
      content,
      listDepartment,
    } = action.payload
    yield call(postsPost, { department: department, title: title, content: content })
    let splitData = _.split(window.location.href, "#");
    let id = splitData[splitData.length - 1]
    if (validate.isValid(id)) {
      let checkId = _.find(listDepartment, { _id: id });
      if (!checkId) {
        return Swal.fire("Tạo thất bại");
      }
      let responseList = yield call(postsList, { department: id, page: 1, perPage: 10 })
      yield put({ type: "posts/success", payload: responseList.data })
    } else {
      window.location.href = window.location.href + "#" + department
      window.location.reload()
    }
    Swal.fire("Tạo thành công")
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
    Swal.fire("Tạo thất bại")
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
  yield takeLatest(requestDetail, postsHandlerDetail);
  yield takeLatest(requestUpdate, postsHandlerUpdate);
  yield takeLatest(requestUpdateStatus, postsHandlerUpdateStatus);
  yield takeLatest(requestPost, postsHandlerPost);
}
