import * as React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { MainLayout, LoginLayout } from './layouts';

import './App.less';

export default class App extends React.Component {
  render() {
    //TODO: 不重要； 使用enquire.js来适配移动端。

    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={LoginLayout} />
          <Route path="/" component={MainLayout} />
        </Switch>
      </BrowserRouter>
    );
  }
}
