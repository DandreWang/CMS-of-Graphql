import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message, InputNumber, Select } from 'antd';
import { dataOp } from '../../components/DataTable';
import { fetchGQL } from '../../components/FetchGQL';
import { SelectSpot } from './SelectSpot';

const query = `
mutation CreateTicketClassDetail($ticketClassId: Int!, $spotId: Int!) {
  ticketClass {
    createDetail(ticketClassId: $ticketClassId, spotId: $spotId) {
      id
    }
  }
}
`;

class CreateTicketClassDetailModal extends React.Component {
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
    this.props.form.validateFields(async (err, { spot }) => {
      if (!err) {
        this.setState({
          submitting: true,
        });
        try {
          await fetchGQL({
            query,
            variables: {
              ticketClassId: this.props.record.id,
              spotId: spot,
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
          添加项目
        </Button>

        <Modal
          visible={visible}
          onCancel={this.hideModal}
          onOk={this.submit}
          confirmLoading={submitting}
          title="添加项目"
        >
          <Form onSubmit={this.submit}>
            <Form.Item label="项目">
              {getFieldDecorator('spot', {
                rules: [{ required: true, message: '请选择项目' }],
              })(<SelectSpot />)}
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default dataOp(Form.create()(CreateTicketClassDetailModal));
