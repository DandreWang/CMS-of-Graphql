import * as React from 'react';
import { Select, Spin, message } from 'antd';
import { dataOp } from './DataTable';
import { fetchGQL } from './FetchGQL';

class EditableSelect extends React.Component {
  state = {
    submitting: false,
  };
  onChange = async value => {
    if (this.state.submitting) {
      return;
    }
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
      submitting: false,
    });
    this.props.reload();
  };
  render() {
    const { children, value } = this.props;
    const { submitting } = this.state;
    return (
      <Spin spinning={submitting}>
        <Select style={{ width: '100%' }} defaultValue={value} onChange={this.onChange} disabled={submitting}>
          {children}
        </Select>
      </Spin>
    );
  }
}
export default dataOp(EditableSelect);
