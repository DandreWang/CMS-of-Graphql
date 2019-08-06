import * as React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import * as styles from './MainLayout.less';
import SiderMenu from '../components/SiderMenu';
import Header from '../components/Header';
import Content from '../components/Content';
import menuData from '../pages';

export default class MainLayout extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Layout className={styles.root}>
        <Layout.Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          {!collapsed && (
            <Link to="/" className={styles.logoContainer}>
              花间乐园
            </Link>
          )}
          {collapsed && (
            <Link to="/" className={styles.logoContainer}>
              花
            </Link>
          )}
          <SiderMenu menuData={menuData} />
        </Layout.Sider>
        <Layout>
          <Layout.Header className={styles.header}>
            <Header />
          </Layout.Header>
          <Layout.Content className={styles.content}>
            <Content menuData={menuData} />
          </Layout.Content>
          <Layout.Footer className={styles.footer}>花间乐园</Layout.Footer>
        </Layout>
      </Layout>
    );
  }
}
