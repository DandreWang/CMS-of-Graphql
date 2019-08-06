import * as React from 'react';
import { Button } from 'antd';
import DataTable from '../../components/DataTable';
import EditableText from '../../components/EditableText';
import DeleteBtn from '../../components/DeleteBtn';
import * as styles from './index.less';
import { FetchSpot, EditSpot } from './SelectSpot';

const UPDATE_QUERY = `
mutation UpdateDevice($id: Int!, $update: DeviceUpdate!) {
  device {
    update(id: $id, update: $update) {
      id
    }
  }
}
`;

const BIND_SPOT_QUERY = `
mutation UpdateDevice($id: Int!, $spotId: Int) {
  device {
    bindSpot(deviceId: $id, spotId: $spotId) {
      id
    }
  }
}
`;

const DELETE_QUERY = `
mutation RemoveDevice($id: Int!) {
  device {
    delete(id: $id) {
      id
    }
  }
}
`;

const COLUMNS = [
  {
    dataIndex: 'id',
    title: 'ID',
  },
  {
    dataIndex: 'sn',
    title: '序列号',
  },
  {
    dataIndex: 'name',
    title: '备注',
    render: (value, record) => (
      <EditableText record={record} fieldName="name" query={UPDATE_QUERY}>
        {value}
      </EditableText>
    ),
  },
  {
    dataIndex: 'spot.id',
    title: '所属设施',
    render: (value, record) => <EditSpot value={value || -1} query={BIND_SPOT_QUERY} record={record} allowNull />,
  },
  {
    dataIndex: 'online',
    title: '状态',
    render: online =>
      online ? <span className={styles.statusOn}>正常</span> : <span className={styles.statusOff}>离线</span>,
  },
  {
    key: 'op',
    title: <div>操作</div>,
    render: record => (
      <Button.Group size="small">
        <DeleteBtn query={DELETE_QUERY} clazz="设施" record={record}>
          删除
        </DeleteBtn>
      </Button.Group>
    ),
  },
];

const QUERY = `
query QuerySpot($skip:Int, $limit: Int, $keyword:String) {
  devices(skip: $skip, limit: $limit, keyword: $keyword) {
    id
    sn
    name
    online
    spot {
      id
    }
  }
}
`;

export default class DevicePage extends React.Component {
  render() {
    return (
      <FetchSpot>
        <DataTable columns={COLUMNS} query={QUERY} field="devices" />
      </FetchSpot>
    );
  }
}
