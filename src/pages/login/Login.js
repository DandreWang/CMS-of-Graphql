import * as React from 'react';
import { Card, Form, Input, Spin, Icon, Button, message } from 'antd';
import * as Axios from 'axios';
import { Redirect } from 'react-router-dom';
import * as styles from './Login.less';
import md5 from '../../utils/md5';

class Login extends React.Component {
  state = {
    submitting: false,
    redirect: false,
  };
  handleSubmit = async e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, { account, pwd }) => {
      if (!err) {
        this.setState({
          submitting: true,
        });
        try {
          const { data, status } = await Axios.post(
            '/admin/login',
            {
              account,
              pwd: md5(pwd),
            },
            {
              json: true,
              validateStatus: state => state < 500,
            },
          );
          if (status >= 400) {
            throw new Error(data.message);
          }
          sessionStorage.setItem('hjadmin_token', data.token);
          this.setState({
            redirect: true,
          });
        } catch (e) {
          this.setState({
            submitting: false,
          });
          message.error(`登录失败：${e.message}`);
        }
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { submitting, redirect } = this.state;
    if (redirect) {
      return <Redirect to="/" />;
    }
    return (
      <Card title="登陆" ref={this.userInput}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="用户名">
            {getFieldDecorator('account', {
              rules: [{ required: true, message: '请输入管理员用户名!' }],
            })(<Input prefix={<Icon type="user" className={styles.icon} />} placeholder="用户名" autoFocus />)}
          </Form.Item>
          <Form.Item label="密码">
            {getFieldDecorator('pwd', {
              rules: [{ required: true, message: '请输入密码' }],
            })(<Input prefix={<Icon type="lock" className={styles.icon} />} type="password" placeholder="密码" />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginBtn} disabled={submitting}>
              {submitting && <Spin className={styles.spin} />}
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(Login);
