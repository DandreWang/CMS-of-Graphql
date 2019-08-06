import * as React from 'react';
import { Input, Spin, message } from 'antd';
import { dataOp } from './DataTable';
import { fetchGQL } from './FetchGQL';

class EditableText extends React.Component {
  state = {
    editing: false,
    submitting: false,
  };
  startEdit = () => {
    this.setState({ editing: true });
  };
  onBlur = () => {
    if (this.state.submitting) {
      return;
    }
    this.setState({ editing: false });
  };
  onPressEnter = async e => {
    if (this.state.submitting) {
      return;
    }
    this.setState({ submitting: true });
    const value = e.target.value;
    const { query, record, fieldName } = this.props;
    try {
      await fetchGQL({
        query,
        variables: {
          id: record.id,
          update: {
            [fieldName]: value,
          },
        },
      });
      message.info('修改成功。');
    } catch (e) {
      console.warn(e.stack);
      message.error(e.message);
    }
    this.setState({
      editing: false,
      submitting: false,
    });
    this.props.reload();
  };
  render() {
    const { children } = this.props;
    const { editing, submitting } = this.state;
    if (!editing) {
      return (
        <div style={{ cursor: 'text' }} onClick={this.startEdit}>
          {children || <span style={{ color: '#ccc' }}>(空)</span>}
        </div>
      );
    }
    return (
      <Spin spinning={submitting}>
        <Input
          defaultValue={children}
          onPressEnter={this.onPressEnter}
          autoFocus
          onBlur={this.onBlur}
          disabled={submitting}
        />
      </Spin>
    );
  }
}

export default dataOp(EditableText);
