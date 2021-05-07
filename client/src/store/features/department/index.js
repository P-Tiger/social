import { createSlice } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  departmentList
} from '../../../data'
import Swal from 'sweetalert2'

const initialState = {
  // all properties in this state would be passed to the
  // reducer for the first time when Redux initializes
  departmentData: []
};

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    request: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return {
        ...state,
        departmentData: []
      }
    },
    success: (state, action) => {
      return {
        ...state,
        departmentData: action.payload,
      }
    },
    after: (state, action) => {
      return {
        ...state,
        departmentData: [...state.departmentData, action.payload]
      }
    },
    failure: (state) => {
      return {
        ...state,
        departmentData: []
      }
    },
    clear: (state) => {
      return {
        ...state,
        departmentData: []
      }
    },
  },
});

export const departmentReducer = departmentSlice.reducer;
export const { request, clear, after } = departmentSlice.actions;

function* departmentHandler(action) {
  try {
    let response = yield call(departmentList)
    yield put({ type: "department/success", payload: response.data })
  } catch (error) {
    if ((error.message).includes('401')) {
      localStorage.removeItem('_Auth')
      window.location.reload();

    } else {
      Swal.fire('get department Error');
    }
    yield put({ type: "department/failure" })
  }
  // perform side effects here
}

// The function below is called a saga and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(barSaga(10))`. This
// will call the async incrementHandler with the `action` as the first argument.
// Async code can then be executed and other actions can be dispatched with yield method.
export function* departmentSaga() {
  // barSaga would listen to incrementByAmount action and call incrementHandler()
  yield takeLatest(request, departmentHandler);
}
