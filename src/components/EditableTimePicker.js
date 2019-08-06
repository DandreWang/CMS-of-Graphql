import * as React from 'react';
import { TimePicker, Spin, message } from 'antd';
import { dataOp } from './DataTable';
import { fetchGQL } from './FetchGQL';
import * as moment from 'moment';

class EditableTimePicker extends React.Component {
  state = {
    submitting: false,
  };
  onChange = async (m, value) => {
    if (this.state.submitting) {
      return;
    }
    this.setState({ submitting: true });
    const { query, record, fieldName } = this.props;

    const update = !!value
      ? {
          [fieldName]: value,
        }
      : {};
    const clears = !value
      ? {
          [fieldName]: true,
        }
      : null;
    try {
      await fetchGQL({
        query,
        variables: {
          id: record.id,
          update,
          clears,
        },
      });
      message.info('修改成功。');
    } catch (e) {
      message.error(e.message);
    }
    this.setState({
      submitting: false,
      value: null,
    });
    this.props.reload();
  };
  render() {
    const { submitting } = this.state;
    const { value } = this.props;
    return (
      <Spin spinning={submitting}>
        <TimePicker value={value && moment(value, 'HH:mm:ss')} onChange={this.onChange} format="HH:mm:ss" />
      </Spin>
    );
  }
}

export default dataOp(EditableTimePicker);
