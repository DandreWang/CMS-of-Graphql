import * as React from 'react';
import { Icon, Upload, message } from 'antd';
import { Buffer } from 'buffer';
import { dataOp } from './DataTable';
import md5 from '../utils/md5';
import * as OSS from 'ali-oss';
import FetchGQL, { fetchGQL } from './FetchGQL';

export const Context = React.createContext();

const PREFIX = '//hj-static.codehere.cn/';

function FetchProvider({ data, children }) {
  data = data && data.data;
  data = data && data.data;
  data = data && data.aliInfo;
  return <Context.Provider value={data}>{children}</Context.Provider>;
}

const query = `
query {
  aliInfo {
    accessKeyId
    secretAccessKey
    bucketName
  }
}
`;

function withAliInfo(Component) {
  return React.forwardRef((props, ref) => (
    <Context.Consumer>{aliInfo => <Component {...props} aliInfo={aliInfo} ref={ref} />}</Context.Consumer>
  ));
}

export class FetchUploadInfo extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <FetchGQL query={query}>
        <FetchProvider>{children}</FetchProvider>
      </FetchGQL>
    );
  }
}

async function customUpload(options, aliInfo) {
  try {
    await new Promise(resolve => setImmediate(resolve));
    const file = options.file;
    if (file.size >= 10 * 1024 * 1024) {
      throw new Error('不能上传超过10M的文件。');
    }
    const m = /\.\w+$/.exec(file.name);
    const ext = m ? m[0] : '';
    const reader = new FileReader();
    const request = await new Promise((resolve, reject) => {
      reader.onload = resolve;
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
    const buffer = new Buffer(request.target.result);
    const key =
      md5(buffer)
        .replace(/=/g, '')
        .replace(/\//g, '_')
        .replace(/\+/g, '-') + ext;

    const client = new OSS({
      region: 'oss-cn-hangzhou',
      accessKeyId: aliInfo.accessKeyId,
      bucket: aliInfo.bucketName,
      accessKeySecret: aliInfo.secretAccessKey,
    });

    // 秒传功能：检查是否已经存在对应的key，并且文件大小一致
    try {
      const info = await client.head(key);

      if (info && info.res && info.res.status === 200) {
        options.onProgress({ percent: 100 });
        options.onSuccess({
          key,
          url: PREFIX + key,
          isExists: true,
        });
        return;
      }
    } catch (e) {
      // ignore.
    }

    await client.multipartUpload(key, file, {
      progress: percent => options.onProgress({ percent }),
    });
    options.onProgress({ percent: 100 });
    options.onSuccess({
      key,
      url: PREFIX + key,
      isExists: false,
    });
  } catch (e) {
    console.error(e.stack);
    // alert('上传失败：' + e.message);
    options.onError(e);
  }
}

export const ImageUpload = withAliInfo(
  class ImageUpload extends React.Component {
    state = {
      file: null,
    };
    renderUploadButton() {
      const { value } = this.props;
      if (value) {
        return (
          <div>
            <img src={value} style={{ width: 100, height: 100 }} />
          </div>
        );
      }
      return (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
    }
    handleChange = async ({ file }) => {
      if (file.status === 'done') {
        this.setState({
          file: null,
        });
        const { onChange } = this.props;
        onChange && onChange(file.response.url);
      } else if (file.status === 'error') {
        this.setState({ file: null });
      } else {
        this.setState({ file });
      }
    };
    handleRemove = () => {
      this.setState({ file: null });
      const { onChange } = this.props;
      onChange && onChange(null);
    };
    handleError = e => {
      message.error(e.message);
    };
    render() {
      const { file } = this.state;
      return (
        <Upload
          customRequest={option => customUpload(option, this.props.aliInfo)}
          listType="picture-card"
          fileList={file ? [file] : []}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          onError={this.handleError}
        >
          {!!file ? null : this.renderUploadButton()}
        </Upload>
      );
    }
  },
);

export const EditableImage = dataOp(
  class EditableImage extends React.Component {
    onChange = async value => {
      const { query, record, fieldName } = this.props;
      try {
        if (!value && !this.props.optional) {
          throw new Error('不能删除该图片');
        }
        await fetchGQL({
          query,
          variables: {
            id: record.id,
            update: {
              [fieldName]: value,
            },
          },
        });
        message.info('修改成功。');
      } catch (e) {
        message.error(e.message);
      }
      this.props.reload();
    };
    render() {
      return <ImageUpload value={this.props.value} onChange={this.onChange} />;
    }
  },
);
