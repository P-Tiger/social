import { createSlice } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  newsList,
  newsDetail,
  newsPut,
  newsPutStatus,
  newsPost
} from '../../../data'
import Swal from 'sweetalert2'
import _ from 'lodash';
import validate from 'objectid'
const initialState = {
  // all properties in this state would be passed to the
  // reducer for the first time when Redux initializes
  newsData: [],
  newsDataDetail: {}
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    request: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        newsData: []
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
        newsDataDetail: {}
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
    requestUpdate: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        newsDataDetail: {}
      }
    },
    requestUpdateStatus: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        newsDataDetail: {}
      }
    },
    success: (state, action) => {
      return {
        ...state,
        newsData: action.payload,
      }
    },
    successDetail: (state, action) => {
      return {
        ...state,
        newsDataDetail: action.payload,
      }
    },
    after: (state, action) => {
      console.log(action.payload)
      return {
        ...state,
        newsData: action.payload
      }
    },
    failureDetail: (state) => {
      return {
        ...state,
        newsDataDetail: {}
      }
    },
    failure: (state) => {
      return {
        ...state,
        newsData: []
      }
    },
    clear: (state) => {
      return {
        ...state,
        newsData: []
      }
    },
    clearDetail: (state) => {
      return {
        ...state,
        newsDataDetail: {}
      }
    },
  },
});

export const newsReducer = newsSlice.reducer;
export const { request, clear, after, requestDetail, clearDetail, requestUpdate, requestUpdateStatus, requestPost, requestPager } = newsSlice.actions;

function* newsHandler(action) {
  try {
    let response = yield call(newsList, action.payload)
    yield put({ type: "news/success", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
    yield put({ type: "news/failure" })
  }
  // perform side effects here
}
function* newsHandlerPager(action) {
  try {
    let response = yield call(newsList, action.payload)
    yield put({ type: "news/success", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
  }
  // perform side effects here
}

function* newsHandlerDetail(action) {
  try {
    let response = yield call(newsDetail, action.payload)
    yield put({ type: "news/successDetail", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
    yield put({ type: "news/failureDetail" })
  }
  // perform side effects here
}



function* newsHandlerUpdate(action) {
  try {

    let response = yield call(newsPut, action.payload)
    yield put({ type: "news/successDetail", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
    yield put({ type: "news/failureDetail" })
  }
  // perform side effects here
}


function* newsHandlerUpdateStatus(action) {
  try {
    let {
      id,
      page
    } = action.payload
    let response = yield call(newsPutStatus, { id: id })
    yield put({ type: "news/successDetail", payload: response.data })
    let splitData = _.split(window.location.href, "#");
    let id_department = splitData[splitData.length - 1]
    if (validate.isValid(id_department)) {
      let responseList = yield call(newsList, { department: id_department, page: page, perPage: 10 })
      yield put({ type: "news/success", payload: responseList.data })
    } else {
      let responseList = yield call(newsList, { page: page, perPage: 10 })
      yield put({ type: "news/success", payload: responseList.data })
    }

    Swal.fire("Xoá thành công")
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {

    }
    yield put({ type: "news/failureDetail" })
  }
  // perform side effects here
}

function* newsHandlerPost(action) {
  try {
    let {
      department,
      title,
      content,
      listDepartment,
    } = action.payload
    yield call(newsPost, { department: department, title: title, content: content })
    let splitData = _.split(window.location.href, "#");
    let id = splitData[splitData.length - 1]
    if (validate.isValid(id)) {
      let checkId = _.find(listDepartment, { _id: id });
      if (!checkId) {
        return Swal.fire("Tạo thất bại");
      }
      let responseList = yield call(newsList, { department: id, page: 1, perPage: 10 })
      yield put({ type: "news/success", payload: responseList.data })
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
export function* newsSaga() {
  // barSaga would listen to incrementByAmount action and call incrementHandler()
  yield takeLatest(request, newsHandler);
  yield takeLatest(requestDetail, newsHandlerDetail);
  yield takeLatest(requestUpdate, newsHandlerUpdate);
  yield takeLatest(requestUpdateStatus, newsHandlerUpdateStatus);
  yield takeLatest(requestPost, newsHandlerPost);
  yield takeLatest(requestPager, newsHandlerPager);
}
