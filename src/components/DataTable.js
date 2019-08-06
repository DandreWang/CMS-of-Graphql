import * as React from 'react';
import { Alert, Spin, Table } from 'antd';
import FetchGQL from './FetchGQL';

export const DataContext = React.createContext({
  reload: () => {
    window.location.reload();
  },
});

export function dataOp(Comp) {
  return React.forwardRef((props, ref) => (
    <DataContext.Consumer>{value => <Comp ref={ref} {...value} {...props} />}</DataContext.Consumer>
  ));
}

function TableContent({ field, loading, data, error, rowKey = 'id', reload, ...others }) {
  data = data && data.data;
  data = data && data.data;
  data = data && data[field];

  return (
    <DataContext.Provider value={{ reload }}>
      <Spin spinning={loading}>
        {error && <Alert>{error}</Alert>}
        <Table dataSource={data} {...others} rowKey={rowKey} />
      </Spin>
    </DataContext.Provider>
  );
}

export default class DataTable extends React.Component {
  render() {
    const { query, field, ...others } = this.props;
    return (
      <FetchGQL query={query}>
        <TableContent field={field} {...others} />
      </FetchGQL>
    );
  }
}
