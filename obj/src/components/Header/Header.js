import * as React from 'react';
import * as styles from './Header.less';
import FetchGQL from '../FetchGQL';
import { Redirect, withRouter } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';

const query = `
{
  me {
    account
  }
}
`;

const SelfMenu = withRouter(
  class SelfMenu extends React.Component {
    logout = () => {
      sessionStorage.removeItem('hjadmin_token');
      this.props.history.replace('/login');
    };
    render() {
      return (
        <Menu>
          <Menu.Item onClick={this.logout}>退出登录</Menu.Item>
        </Menu>
      );
    }
  },
);

function SelfBtn({ loading, data, error }) {
  if (loading || error) {
    return null;
  }
  if (data.status === 401) {
    return <Redirect to="/login" />;
  }
  if (data.data.errors) {
    return null;
  }
  return (
    <Dropdown overlay={<SelfMenu />}>
      <div className={styles.selfBtn}>
        管理员：
        {data.data.data.me.account}
      </div>
    </Dropdown>
  );
}

export default class Header extends React.Component {
  render() {
    return (
      <React.Fragment>
        <FetchGQL query={query}>
          <SelfBtn />
        </FetchGQL>
      </React.Fragment>
    );
  }
}
