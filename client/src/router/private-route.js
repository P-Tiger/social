import $ from 'jquery';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, Route } from 'react-router';
import { io } from 'socket.io-client';
import { after } from '../store/features/news';

let socket = null;
export const PrivateRoute = ({ component: Component, ...rest }) => {
    let user = JSON.parse(localStorage.getItem("_Auth"))
    let server = process.env.REACT_APP_SOCKET;
    const dispatch = useDispatch()
    if (user) {
        socket = io(server, {
            transports: ["websocket"],
            withCredentials: true
        })
    }
    useEffect(() => {
        socket.on("Output Create", data => {
            if (data.dataList) {
                dispatch(after(data.dataList))
            }
            if (user?.type === 3) {
                $(".notify").append(`
            <div class="fade toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <img src="holder.js/20x20?text=%20" class="rounded mr-2" alt="">
                <strong class="mr-auto">${data?.data?.title}</strong>
                <small>
                    ${moment(data?.data?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </small>
                <button type="button" class="close ml-2 mb-1" data-dismiss="toast">
            <span aria-hidden="true">
            ×
            </span>
                    <span class="sr-only">
                        Close
                    </span>
                </button>
                </div>
                <div class="toast-body">
                    Bạn có thông báo từ phòng ${data?.data?.department?.name}
                </div>
            </div>`);
                setTimeout(() => {
                    $(".fade.toast.show").remove()
                }, 5000)
            }
        })
    }, [user?.type, dispatch])

    return (
        <Route
            {...rest}
            render={props => (
                localStorage.getItem("_Auth") ?
                    <Component {...props} socket={socket} />
                    :
                    <Redirect
                        to={{ pathname: "/" }}
                    />
            )}
        />
    )
}