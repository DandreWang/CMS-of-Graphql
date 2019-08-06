import * as React from 'react';
import { Button, Input, Popconfirm, message } from 'antd';
import { fetchGQL } from '../../components/FetchGQL';
import { dataOp } from '../../components/DataTable';
import md5 from '../../utils/md5';

const query = `
mutation ChangeAdminPwd($id: Int!, $password: String!) {
  admin {
    changePwd(id: $id, password: $password) {
      id
    }
  }
}
`;

export const VALIDATE_PASSWORD_REG = /^(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^\W+$).{8,}$/;

class ChangePwdBtn extends React.Component {
  state = {
    visible: false,
    password: '',
  };
  ref = React.createRef();
  onClick = () => {
    this.setState({ visible: true });
  };
  onValueChange = e => {
    this.setState({ password: e.target.value });
  };
  onCancel = () => this.setState({ visible: false, password: '' });
  onConfirm = async e => {
    const {
      record: { id },
    } = this.props;
    const { password } = this.state;
    if (!VALIDATE_PASSWORD_REG.test(password)) {
      alert('密码至少8位，并且必须包含数字、字母、特殊字符中的至少两种以上。');
      e.stopPropagation();
      this.ref.current.focus();
      return;
    }
    this.setState({
      visible: false,
      password: '',
    });
    await fetchGQL({
      query,
      variables: {
        id,
        password: md5(password),
      },
    });
    message.info('密码修改成功。');
    this.props.reload();
  };
  render() {
    const { password, visible } = this.state;
    return (
      <Popconfirm
        visible={visible}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        title={
          <div>
            新密码：
            <Input type="password" autoFocus value={password} onChange={this.onValueChange} ref={this.ref} onPressEnter={this.onConfirm}/>
          </div>
        }
      >
        <Button onClick={this.onClick}>修改密码</Button>
      </Popconfirm>
    );
  }
}

export default dataOp(ChangePwdBtn);
