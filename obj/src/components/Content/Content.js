import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

export default class Content extends React.Component {
  renderItem = menuData => {
    const { key } = menuData;
    const { path = '/' } = this.props;
    return (
      <Route key={key} path={path + key} render={props => <Content menuData={menuData} path={path + key + '/'} />} />
    );
  };
  render() {
    const { menuData, path = '/' } = this.props;
    const { items, component: Comp } = menuData;
    return (
      <Switch>
        {Comp && <Route key="index" exact path={path} component={Comp} />}
        {items && items.map(this.renderItem)}
        <Redirect to="/" />
      </Switch>
    );
  }
}
