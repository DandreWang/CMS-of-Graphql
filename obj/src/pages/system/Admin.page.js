import * as React from 'react';
import { Button } from 'antd';
import DataTable, { DataContext } from '../../components/DataTable';
import DeleteBtn from '../../components/DeleteBtn';
import { format } from 'date-fns';
import ChangePwdBtn from './ChangePwdBtn';
import EditableText from '../../components/EditableText';
import CreateAdminModal from './CreateAdminModal';

const UPDATE_QUERY = `
mutation UpdateAdmin($id: Int!, $update: AdminUpdate!) {
  admin {
    update(id: $id, update: $update) {
      id
    }
  }
}
`;

const DELETE_QUERY = `
mutation RemoveAdmin($id: Int!) {
  admin {
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
    dataIndex: 'account',
    title: '账号',
    render: (value, record) => (
      <EditableText record={record} fieldName="account" query={UPDATE_QUERY}>
        {value}
      </EditableText>
    ),
  },
  {
    dataIndex: 'createdAt',
    title: '创建时间',
    render: t => format(new Date(t), 'YYYY-MM-DD HH:mm'),
  },
  {
    key: 'op',
    title: (
      <div>
        操作
        <CreateAdminModal />
      </div>
    ),
    render: record => (
      <Button.Group size="small">
        <DeleteBtn query={DELETE_QUERY} clazz="管理员" record={record}>
          删除
        </DeleteBtn>
        <ChangePwdBtn record={record} />
      </Button.Group>
    ),
  },
];

const QUERY = `
query QueryAdmin($skip:Int, $limit: Int, $keyword:String) {
  admins(skip: $skip, limit: $limit, keyword: $keyword) {
    id
    account
    createdAt
  }
}
`;

export default class AdminPage extends React.Component {
  render() {
    return <DataTable columns={COLUMNS} query={QUERY} field="admins" />;
  }
}
