import React from 'react';
import {
  BrowserRouter, Switch
} from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {
  NotFound,
  Home,
  Login,
  FormUser,
  Me,
  News
} from '../routes';
import { PrivateRoute } from './private-route';
import { PublicRoute } from './public-route';




export const Router = () => (
  <BrowserRouter >
    <Switch>
      <PublicRoute exact path="/" component={Login} />
      <PrivateRoute exact path="/home" component={Home} />
      <PrivateRoute exact path="/users" component={FormUser} />
      <PrivateRoute exact path="/me" component={Me} />
      <PrivateRoute exact path="/news" component={News} />
      <PrivateRoute path="*" component={NotFound} />
    </Switch>
  </BrowserRouter>
);
