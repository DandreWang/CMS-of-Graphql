import * as React from 'react';
import FetchGQL from '../../components/FetchGQL';
import { Select, Spin, message } from 'antd';
import { dataOp } from '../../components/DataTable';
import { fetchGQL } from '../../components/FetchGQL';

const Context = React.createContext({
  data: [],
});

const query = `
query {
  spots {
    id
    name
  }
}
`;

function FetchProvider({ data, children }) {
  data = data && data.data;
  data = data && data.data;
  data = data && data.spots;
  return <Context.Provider value={data}>{children}</Context.Provider>;
}

export class FetchSpot extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <FetchGQL query={query}>
        <FetchProvider>{children}</FetchProvider>
      </FetchGQL>
    );
  }
}

export const SelectSpot = React.forwardRef(({ allowNull, ...props }, ref) => (
  <Context.Consumer>
    {data => (
      <Select style={{ width: '100%' }} {...props} ref={ref}>
        {allowNull && <Select.Option value={-1}>未绑定</Select.Option>}
        {data &&
          data.map(v => (
            <Select.Option value={v.id} key={v.id}>
              {v.name}
            </Select.Option>
          ))}
      </Select>
    )}
  </Context.Consumer>
));

export const EditSpot = dataOp(
  class EditSpot extends React.Component {
    state = {
      submitting: false,
    };
    onChange = async value => {
      if (this.state.submitting) {
        return;
      }
      this.setState({ submitting: true });
      const { query, record } = this.props;
      try {
        await fetchGQL({
          query,
          variables: {
            id: record.id,
            spotId: value === -1 ? null : value,
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
      const { value, query, record, ...others } = this.props;
      const { submitting } = this.state;
      return (
        <Spin spinning={submitting}>
          <SelectSpot
            style={{ width: '100%' }}
            defaultValue={value}
            onChange={this.onChange}
            disabled={submitting}
            {...others}
          />
        </Spin>
      );
    }
  },
);
