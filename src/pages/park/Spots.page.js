import * as React from 'react';
import { Button } from 'antd';
import DataTable from '../../components/DataTable';
import EditableNumber from '../../components/EditableNumber';
import EditableText from '../../components/EditableText';
import DeleteBtn from '../../components/DeleteBtn';
import CreateSpotModal from './CreateSpotModal';

const UPDATE_QUERY = `
mutation UpdateSpot($id: Int!, $update: SpotUpdate!) {
  spot {
    update(id: $id, update: $update) {
      id
    }
  }
}
`;

const DELETE_QUERY = `
mutation RemoveSpot($id: Int!) {
  spot {
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
    dataIndex: 'name',
    title: '设施名称',
    render: (value, record) => (
      <EditableText record={record} fieldName="name" query={UPDATE_QUERY}>
        {value}
      </EditableText>
    ),
  },
  {
    dataIndex: 'price',
    title: '价格',
    render: (value, record) => (
      <EditableNumber record={record} fieldName="price" query={UPDATE_QUERY} value={value} isMoney />
    ),
  },
  {
    key: 'op',
    title: (
      <div>
        操作
        <CreateSpotModal />
      </div>
    ),
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
  spots(skip: $skip, limit: $limit, keyword: $keyword) {
    id
    name
    price
  }
}
`;

export default class SpotPage extends React.Component {
  render() {
    return <DataTable columns={COLUMNS} query={QUERY} field="spots" />;
  }
}
