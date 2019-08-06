import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message, InputNumber, Select } from 'antd';
import { dataOp } from '../../components/DataTable';
import { fetchGQL } from '../../components/FetchGQL';
import { ImageUpload } from '../../components/Upload';

const query = `
mutation CreateTicketClass($ticketClass: TicketClassCreate!) {
  ticketClass {
    create(ticketClass: $ticketClass) {
      id
    }
  }
}
`;

class CreateTicketClassModal extends React.Component {
  state = {
    visible: false,
    submitting: false,
  };
  showModal = () => {
    this.setState({ visible: true });
  };
  hideModal = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
  };
  submit = e => {
    e && e.prevertDefault && e.prevertDefault();
    this.props.form.validateFields(async (err, { price, ...others }) => {
      if (!err) {
        this.setState({
          submitting: true,
        });
        try {
          await fetchGQL({
            query,
            variables: {
              ticketClass: {
                ...others,
                price: Math.round(price * 100),
              },
            },
          });
          this.setState({
            submitting: false,
            visible: false,
          });
        } catch (e) {
          console.warn(e.stack);
          this.setState({
            submitting: false,
          });
          message.error(`创建失败：${e.message}`);
        }
      }
      this.props.reload();
    });
  };
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.file && e.file.url;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, submitting } = this.state;
    return (
      <React.Fragment>
        <Button style={{ float: 'right' }} size="small" onClick={this.showModal}>
          新建
        </Button>

        <Modal
          visible={visible}
          onCancel={this.hideModal}
          onOk={this.submit}
          confirmLoading={submitting}
          title="新建票种"
        >
          <Form onSubmit={this.submit}>
            <Form.Item label="票种名">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入票种名' }],
              })(
                <Input
                  prefix={<Icon type="environment" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="票种名"
                  autoFocus
                />,
              )}
            </Form.Item>
            <Form.Item label="简介">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '请输入简介' }],
              })(
                <Input prefix={<Icon type="environment" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="简介" />,
              )}
            </Form.Item>
            <Form.Item label="定价">
              {getFieldDecorator('price', {
                initialValue: 30,
                rules: [
                  {
                    required: true,
                    message: '请输入价格',
                  },
                ],
              })(<InputNumber style={{ width: '100%' }} step={0.01} />)}
            </Form.Item>

            <Form.Item label="主图">
              {getFieldDecorator('imageUrl', {
                rules: [
                  {
                    required: true,
                    message: '请上传主图',
                  },
                ],
              })(
                <ImageUpload>
                  <Button>
                    <Icon type="upload" /> Click to upload
                  </Button>
                </ImageUpload>,
              )}
            </Form.Item>

            <Form.Item label="类别">
              {getFieldDecorator('category', {
                initialValue: 'spot',
              })(
                <Select style={{ width: '100%' }} onChange={this.onChange} disabled={submitting}>
                  <Select.Option value="entrance">门票</Select.Option>
                  <Select.Option value="spot">项目票</Select.Option>
                  <Select.Option value="set">套票</Select.Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="状态">
              {getFieldDecorator('deleted', {
                initialValue: 1,
              })(
                <Select style={{ width: '100%' }} onChange={this.onChange} disabled={submitting}>
                  <Select.Option value={0}>上架中</Select.Option>
                  <Select.Option value={1}>已下架</Select.Option>
                </Select>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default dataOp(Form.create()(CreateTicketClassModal));
