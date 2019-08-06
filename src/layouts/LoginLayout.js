import * as React from 'react';
import * as styles from './LoginLayout.less';
import Login from '../pages/login/Login';
import { Switch, Route } from 'react-router';

export default class LoginLayout extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>花间乐园管理后台</h1>
        <Switch>
          <Route path="/login" component={Login} />
        </Switch>
      </div>
    );
  }
}
