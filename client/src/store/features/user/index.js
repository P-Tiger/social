import { createSlice } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  userPost,
  userDetail,
  userUpdate
} from '../../../data'
import Swal from 'sweetalert2'

const initialState = {
  // all properties in this state would be passed to the
  // reducer for the first time when Redux initializes
  userData: {},
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    request: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        userData: {}
      }
    },
    requestDetail: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        userData: {}
      }
    },
    requestUpdate: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state
      }
    },
    success: (state, action) => {
      return {
        ...state,
        userData: action.payload
      }
    },
    failureUpdate: (state, action) => {
      return {
        ...state,
        userData: action.payload
      }
    },
    failure: (state) => {
      return {
        ...state,
        userData: {}
      }
    },
    clear: (state) => {
      return {
        ...state,
        userData: {},
      }
    },
  },
});

export const userReducer = userSlice.reducer;
export const { request, clear, requestDetail, requestUpdate } = userSlice.actions;

function* userHandler(action) {
  try {
    let response = yield call(userPost, action.payload)
    yield put({ type: "user/success", payload: response.data })
    Swal.fire('Tạo người dùng Thành công')
  } catch (error) {
    if (JSON.stringify(error.message).includes('409')) {
      Swal.fire('Username đã tồn tại')
    }
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {
      Swal.fire('Tạo người dùng lỗi')
    }
    yield put({ type: "user/failure" })
  }
  // perform side effects here
}

function* userHandlerDetail(action) {
  try {
    let response = yield call(userDetail, action.payload)
    yield put({ type: "user/success", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {
      Swal.fire('Lấy thông tin user lỗi')
    }
    yield put({ type: "user/failure" })
  }
  // perform side effects here
}

function* userHandlerUpdate(action) {
  try {
    let response = yield call(userUpdate, action.payload)
    yield put({ type: "user/success", payload: response.data })
    Swal.fire('Update thong tin Thanh cong')
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();
    } else {
      Swal.fire('Update thong tin lỗi')
    }
    yield put({ type: "user/failureUpdate" })
  }
  // perform side effects here
}

// The function below is called a saga and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(barSaga(10))`. This
// will call the async incrementHandler with the `action` as the first argument.
// Async code can then be executed and other actions can be dispatched with yield method.
export function* userSaga() {
  // barSaga would listen to incrementByAmount action and call incrementHandler()
  yield takeLatest(request, userHandler);
  yield takeLatest(requestDetail, userHandlerDetail);
  yield takeLatest(requestUpdate, userHandlerUpdate);
}
