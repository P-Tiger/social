import $ from 'jquery';
import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router';
import { io } from 'socket.io-client';


let socket = null;
export const PrivateRoute = ({ component: Component, ...rest }) => {
    let user = JSON.parse(localStorage.getItem("_Auth"))
    let server = process.env.REACT_APP_SOCKET;
    if (user) {
        socket = io(server, {
            transports: ["websocket"],
            withCredentials: true
        })
    }
    useEffect(() => {
        socket.on("Output Create", data => {
            if (user?.type === 3) {
                console.log(user?.type)
                let test = $(".notify").append(`
            <div class="fade toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
            <img src="holder.js/20x20?text=%20" class="rounded mr-2" alt="">
            <strong class="mr-auto">Bootstrap</strong><small>11 mins ago</small><button type="button" class="close ml-2 mb-1" data-dismiss="toast"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button></div><div class="toast-body">Woohoo, you're reading this text in a Toast!</div></div>`);
                let interval = null
                if (interval) {
                    clearInterval(interval)
                }
                interval = setInterval(() => {
                    test.remove();
                }, 5000)
            }
        })
    }, [user?.type])

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