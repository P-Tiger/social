import React from 'react';
import {
  BrowserRouter, Switch
} from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {
  About,
  Home,
  Login
} from '../routes';
import { PrivateRoute } from './private-route';
import { PublicRoute } from './public-route';




export const Router = () => (
  <BrowserRouter >
    <Switch>
      <PublicRoute exact path="/" component={Login} />
      <PrivateRoute exact path="/home" component={Home} />
      <PrivateRoute exact path="/about" component={About} />
      <PrivateRoute path="*" component={About} />
    </Switch>
  </BrowserRouter>
);
