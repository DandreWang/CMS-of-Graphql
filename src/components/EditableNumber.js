import * as React from 'react';
import { InputNumber, Spin, message } from 'antd';
import { dataOp } from './DataTable';
import { fetchGQL } from './FetchGQL';

class EditableNumber extends React.Component {
  state = {
    editing: false,
    submitting: false,
    value: null,
  };
  startEdit = () => {
    this.setState({
      editing: true,
      value: this.props.value,
    });
  };
  onBlur = () => {
    if (this.state.submitting) {
      return;
    }
    this.setState({ editing: false, value: null });
  };
  onChange = value => {
    const { isMoney } = this.props;
    if (isMoney) {
      value = Math.round(value * 100);
    }
    this.setState({ value });
  };
  onKeyDown = async e => {
    if (e.keyCode === 13) {
      this.onPressEnter(e);
    }
  };
  onPressEnter = async e => {
    if (this.state.submitting) {
      return;
    }
    const { value } = this.state;
    this.setState({ submitting: true });
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
      message.error(e.message);
    }
    this.setState({
      editing: false,
      submitting: false,
      value: null,
    });
    this.props.reload();
  };
  render() {
    const { editing, submitting } = this.state;
    const { isMoney, value } = this.props;
    if (!editing) {
      return <span onClick={this.startEdit}>{isMoney ? (value / 100).toFixed(2) : value}</span>;
    }
    return (
      <Spin spinning={submitting}>
        <InputNumber
          defaultValue={isMoney ? value / 100 : value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          autoFocus
          onBlur={this.onBlur}
          disabled={submitting}
          step={isMoney ? 0.01 : 1}
          precision={2}
        />
      </Spin>
    );
  }
}

export default dataOp(EditableNumber);
