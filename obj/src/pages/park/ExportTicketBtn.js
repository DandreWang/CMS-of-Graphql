import * as React from 'react';
import { Button, Popconfirm, InputNumber, Modal, Progress } from 'antd';
import createWriteStream from '../../utils/streamSaver';
import * as stringify from 'csv-stringify';
import { fetchGQL } from '../../components/FetchGQL';
import * as format from 'date-fns/format';

const query = `
mutation GenerateTicket($ticketClassId:Int!, $count:Int!) {
  ticket {
    generateTickets(ticketClassId:$ticketClassId, count:$count) {
      id
      qrcode
    }
  }
}
`;

const BATCH_SIZE = 200;

async function exportTickets({ id, name }, count, onProgress) {
  const fileStream = await createWriteStream(`出票列表-${name}-${count}-${format(new Date(), 'MMDDHHmmss')}.csv`, {
    contentType: 'text/csv; charset-utf-8',
  });
  const writer = fileStream.getWriter();
  const encoder = new TextEncoder();

  writer.write(encoder.encode('\ufeff'));

  const stringifier = stringify({
    lineBreaks: 'windows',
  });
  stringifier.on('readable', function() {
    let row;
    while ((row = stringifier.read())) {
      writer.write(encoder.encode(row));
    }
  });
  stringifier.on('finish', function() {
    writer.close();
  });

  stringifier.write(['ID', '票种', '二维码']);

  let rest = count;

  while (rest > 0) {
    const resp = await fetchGQL({
      query,
      variables: {
        ticketClassId: id,
        count: Math.min(rest, BATCH_SIZE),
      },
    });
    if (!resp.data) {
      throw new Error('生成失败');
    }
    for (const item of resp.data.data.ticket.generateTickets) {
      stringifier.write([item.id, name, item.qrcode]);
    }
    rest -= BATCH_SIZE;
    onProgress && onProgress((count - rest) / count);
  }
  // for (let i = 0; i < count; i++) {
  //   writer.write(encoder.encode('Foo\n'));
  // }
  stringifier.end();
}

export default class ExportTicketBtn extends React.Component {
  state = {
    count: 10,
    progress: null,
  };
  onValueChange = count => {
    this.setState({ count });
  };
  onConfirm = () => {
    const { count } = this.state;
    if (count > 1000000) {
      alert('一次最多导出1000000行，否则文件会无法打开！');
      return;
    }
    this.setState({
      progress: 0,
    });
    exportTickets(this.props.record, count, progress => {
      this.setState({
        progress,
      });
    }).then(
      () => {
        setTimeout(() => {
          this.setState({
            progress: null,
          });
        }, 500);
      },
      e => {
        alert(`导出失败: ${e.message}`);
        this.setState({
          progress: null,
        });
      },
    );
  };
  render() {
    const { progress, count } = this.state;
    return (
      <React.Fragment>
        <Popconfirm
          title={
            <div>
              出票数量：
              <InputNumber autoFocus value={count} onChange={this.onValueChange} />
            </div>
          }
          onConfirm={this.onConfirm}
        >
          <Button>出票</Button>
        </Popconfirm>
        <Modal
          visible={progress != null}
          closable={false}
          destroyOnClose
          size="small"
          footer={null}
          width={205}
          style={{ textAlign: 'center' }}
        >
          <Progress type="circle" percent={Math.floor(progress * 100)} />
        </Modal>
      </React.Fragment>
    );
  }
}
