import * as React from 'react';
import { Modal, Button } from 'antd';

export default class ModalBtn extends React.Component {
  state = { visible: false };
  onClick = () => {
    this.setState({ visible: true });
  };

  onOk = e => {
    const { onOk } = this.props;
    onOk && onOk(e);
    this.setState({
      visible: false,
    });
  };

  onCancel = e => {
    const { onCancel } = this.props;
    onCancel && onCancel(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const { title, btnTitle, children, ...others } = this.props;
    const { visible } = this.state;

    return (
      <React.Fragment>
        <Button onClick={this.onClick}>{btnTitle || title}</Button>
        <Modal {...others} title={title} onOk={this.onOk} visible={visible} onCancel={this.onCancel}>
          {children}
        </Modal>
      </React.Fragment>
    );
  }
}
