import * as React from 'react';
import { Button, Select, Table, DatePicker } from 'antd';
import DataTable from '../../components/DataTable';
import * as styles from './index.less';
import ExportTicketBtn from './ExportTicketBtn';
import EditableNumber from '../../components/EditableNumber';
import EditableText from '../../components/EditableText';
import DeleteBtn from '../../components/DeleteBtn';
import EditableSelect from '../../components/EditableSelect';
import { EditableImage, FetchUploadInfo } from '../../components/Upload';
import CreateTicketClassModal from './CreateTicketClassModal';
import CreateTicketClassDetailModal from './CreateTicketClassDetailModal';
import { FetchSpot } from './SelectSpot';
import EditableDatePicker from '../../components/EditableDatePicker';
import EditableTimePicker from '../../components/EditableTimePicker';

const UPDATE_QUERY = `
mutation UpdateTicketClass($id: Int!, $update: TicketClassUpdate!, $clears: TicketClassClears) {
  ticketClass {
    update(id: $id, update: $update, clears: $clears) {
      id
    }
  }
}
`;

const DELETE_QUERY = `
mutation RemoveTicketClass($id: Int!) {
  ticketClass {
    delete(id: $id) {
      id
    }
  }
}
`;

const DELETE_DETAIL_QUERY = `
mutation RemoveTicketClassDetail($id: Int!) {
  ticketClass {
    removeDetail(id: $id) {
      id
    }
  }
}
`;

const CATEGORIES = {
  entrance: '门票',
  spot: '项目票',
  set: '套票',
  vip: 'VIP票',
};

const COLUMNS = [
  {
    dataIndex: 'id',
    title: 'ID',
  },
  {
    dataIndex: 'imageUrl',
    title: '图片',
    render: (value, record) => (
      <EditableImage record={record} value={value} fieldName="imageUrl" query={UPDATE_QUERY} />
    ),
  },
  {
    dataIndex: 'name',
    title: '票种名称',
    render: (value, record) => (
      <EditableText record={record} fieldName="name" query={UPDATE_QUERY}>
        {value}
      </EditableText>
    ),
  },
  {
    dataIndex: 'category',
    title: '类别',
    width: 60,
    render: (category, record) => (
      <EditableSelect record={record} fieldName="category" query={UPDATE_QUERY} value={category}>
        <Select.Option value="entrance">门票</Select.Option>
        <Select.Option value="spot">项目票</Select.Option>
        <Select.Option value="set">套票</Select.Option>
      </EditableSelect>
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
    dataIndex: 'deleted',
    title: '状态',
    width: 60,
    render: (deleted, record) => (
      <EditableSelect record={record} fieldName="deleted" query={UPDATE_QUERY} value={deleted}>
        <Select.Option value={0}>上架中</Select.Option>
        <Select.Option value={1}>已下架</Select.Option>
      </EditableSelect>
    ),
  },
  {
    key: 'op',
    title: (
      <div>
        操作
        <CreateTicketClassModal />
      </div>
    ),
    render: record => (
      <Button.Group size="small">
        <DeleteBtn query={DELETE_QUERY} clazz="票种" record={record}>
          删除
        </DeleteBtn>
        <ExportTicketBtn record={record} />
      </Button.Group>
    ),
  },
];

class DetailList extends React.Component {
  DETAIL_COLUMNS = [
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'spot.name',
      title: '项目',
    },
    {
      key: 'op',
      title: (
        <div>
          操作
          <CreateTicketClassDetailModal record={this.props.record} />
        </div>
      ),
      render: record => (
        <Button.Group size="small">
          <DeleteBtn query={DELETE_DETAIL_QUERY} clazz="项目" record={record}>
            删除
          </DeleteBtn>
        </Button.Group>
      ),
    },
  ];

  render() {
    const { record } = this.props;
    return <Table dataSource={record.details} columns={this.DETAIL_COLUMNS} rowKey="id" />;
  }
}

const renderExpandedRow = record => (
  <div>
    <h3 className={styles.h3}>票种介绍（点击修改，回车保存）：</h3>
    <EditableText record={record} fieldName="description" query={UPDATE_QUERY}>
      {record.description}
    </EditableText>

    <h3 className={styles.h3}>时间限制</h3>
    <div>
      <div className={styles.row}>
        <div>开始结束日期</div>
        <EditableDatePicker
          record={record}
          value={record.limitStartDate}
          fieldName="limitStartDate"
          query={UPDATE_QUERY}
        />
        <EditableDatePicker record={record} value={record.limitEndDate} fieldName="limitEndDate" query={UPDATE_QUERY} />
      </div>
      <div className={styles.row}>
        <div>开始结束时间</div>
        <EditableTimePicker
          record={record}
          value={record.limitStartTime}
          fieldName="limitStartTime"
          query={UPDATE_QUERY}
        />
        <EditableTimePicker record={record} value={record.limitEndTime} fieldName="limitEndTime" query={UPDATE_QUERY} />
      </div>
    </div>

    <h3 className={styles.h3}>
      项目列表
      <span style={{ color: 'red' }}>（注意：修改项目列表不影响已经购买/出票的票，所以上架后谨慎修改）：</span>
    </h3>
    <DetailList record={record} />
  </div>
);

const QUERY = `
query QuerySpot($skip:Int, $limit: Int, $keyword:String) {
  ticketClasses(skip: $skip, limit: $limit, keyword: $keyword) {
    id
    name
    description
    price
    imageUrl
    category
    deleted
    limitStartDate
    limitEndDate
    limitStartTime
    limitEndTime

    details {
      id
      spot {
        name
      }
    }
  }
}
`;

export default class TicketClassPage extends React.Component {
  render() {
    return (
      <FetchUploadInfo>
        <FetchSpot>
          <DataTable columns={COLUMNS} query={QUERY} field="ticketClasses" expandedRowRender={renderExpandedRow} />
        </FetchSpot>
      </FetchUploadInfo>
    );
  }
}
