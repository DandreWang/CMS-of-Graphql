import * as React from 'react';
import { Button, Modal, Form, Input, Icon, message, InputNumber } from 'antd';
import { dataOp } from '../../components/DataTable';
import { fetchGQL } from '../../components/FetchGQL';

const query = `
mutation CreateSpot($spot: SpotCreate!) {
  spot {
    create(spot: $spot) {
      id
    }
  }
}
`;

class CreateSpotModal extends React.Component {
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
    this.props.form.validateFields(async (err, { name, price }) => {
      if (!err) {
        this.setState({
          submitting: true,
        });
        try {
          await fetchGQL({
            query,
            variables: {
              spot: {
                name,
                price: Math.round(price * 100),
              },
            },
          });
          this.setState({
            submitting: false,
            visible: false,
          });
        } catch (e) {
          this.setState({
            submitting: false,
          });
          message.error(`创建失败：${e.message}`);
        }
      }
      this.props.reload();
    });
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
          title="新建设施"
        >
          <Form onSubmit={this.submit}>
            <Form.Item label="设施名">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入设施名' }],
              })(
                <Input
                  prefix={<Icon type="environment" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="设施名"
                  autoFocus
                />,
              )}
            </Form.Item>
            <Form.Item label="定价(直接扫码价格)">
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
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default dataOp(Form.create()(CreateSpotModal));
