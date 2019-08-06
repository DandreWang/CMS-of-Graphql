import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message } from 'antd';
import { dataOp } from '../../components/DataTable';
import { fetchGQL } from '../../components/FetchGQL';
import md5 from '../../utils/md5';
import { VALIDATE_PASSWORD_REG } from './ChangePwdBtn';

const query = `
mutation CreateAdmin($admin: AdminCreate!) {
  admin {
    create(admin: $admin) {
      id
    }
  }
}
`;

class CreateAdminModal extends React.Component {
  state = {
    visible: false,
    submitting: false,
  };
  showModal = () => {
    this.setState({ visible: true });
  };
  hideModal = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  };
  submit = e => {
    e && e.prevertDefault && e.prevertDefault();
    this.props.form.validateFields(async (err, { account, password }) => {
      if (!err) {
        this.setState({
          submitting: true,
        });
        try {
          await fetchGQL({
            query,
            variables: {
              admin: {
                account,
                password: md5(password),
              },
            },
          });
          this.setState({
            submitting: false,
            visible: false,
          });
        } catch (e) {
          this.setState({
            submitting: false,
          });
          message.error(`创建失败：${e.message}`);
        }
      }
      this.props.reload();
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, submitting } = this.state;
    return (
      <React.Fragment>
        <Button style={{ float: 'right' }} size="small" onClick={this.showModal}>
          新建
        </Button>

        <Modal
          visible={visible}
          onCancel={this.hideModal}
          onOk={this.submit}
          confirmLoading={submitting}
          title="新建管理员"
        >
          <Form onSubmit={this.submit}>
            <Form.Item label="用户名">
              {getFieldDecorator('account', {
                rules: [{ required: true, message: '请输入管理员的用户名' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                  autoFocus
                />,
              )}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '密码至少8位，并且必须包含数字、字母、特殊字符中的至少两种以上。',
                    pattern: VALIDATE_PASSWORD_REG,
                  },
                ],
              })(
                <Input
                  type="password"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="密码"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default dataOp(Form.create()(CreateAdminModal));
