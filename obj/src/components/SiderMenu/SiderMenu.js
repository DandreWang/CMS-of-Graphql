import * as React from 'react';
import { Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom';

class SiderMenu extends React.Component {
  renderMenuItem = ({ key, title, icon, items }, basePath) => {
    if (icon) {
      title = (
        <span>
          <Icon type={icon} />
          <span>{title}</span>
        </span>
      );
    }
    basePath = basePath + '/' + key;
    if (items) {
      return (
        <Menu.SubMenu key={key} title={title}>
          {items.map(v => this.renderMenuItem(v, basePath))}
        </Menu.SubMenu>
      );
    }
    return <Menu.Item key={basePath}>{title}</Menu.Item>;
  };
  onSelect = ({ key }) => {
    this.props.history.push(key);
  };
  render() {
    const { history, menuData } = this.props;
    const { pathname } = history.location;
    const groups = pathname.split('/').filter(v => !!v);
    groups.pop();

    return (
      <Menu theme="dark" mode="inline" defaultOpenKeys={groups} selectedKeys={[pathname]} onSelect={this.onSelect}>
        {menuData.items.map(v => this.renderMenuItem(v, ''))}
      </Menu>
    );
  }
}

export default withRouter(SiderMenu);
