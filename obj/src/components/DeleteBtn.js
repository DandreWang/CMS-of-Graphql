import * as React from 'react';
import { Button, Popconfirm, message } from 'antd';
import { fetchGQL } from './FetchGQL';
import { dataOp } from './DataTable';

class DeleteBtn extends React.Component {
  onConfirm = async () => {
    const { query, record } = this.props;
    try {
      const resp = await fetchGQL({
        query,
        variables: { id: record.id },
      });
      message.info('删除成功。');
    } catch (e) {
      message.error(e.message);
    }

    this.props.reload();
  };
  render() {
    const { query, record, clazz, reload, ...others } = this.props;
    return (
      <Popconfirm title={`确定要删除这个${clazz}吗？`} onConfirm={this.onConfirm}>
        <Button type="danger" {...others} />
      </Popconfirm>
    );
  }
}

export default dataOp(DeleteBtn);
