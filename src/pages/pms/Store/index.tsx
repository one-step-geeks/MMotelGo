import { Space, Card, Button, Row, Col, message, Upload, Spin } from 'antd';
import { useModel, useRequest } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-form';
import { RcFile } from 'antd/es/upload';
import Cookie from 'js-cookie';
import { useHistory } from 'umi';
import services from '@/services';
import { useIntl } from 'umi';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import storeDefaultCover from '@/assets/images/storeDefaultCover.png';
import logo from '@/assets/images/logohome.png';
import './style.less';
import { ProCard } from '@ant-design/pro-components';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function StorePage() {
  const history = useHistory();
  const { refresh } = useModel('@@initialState');
  const intl = useIntl();
  const [imgUrl, setImgUrl] = useState('');
  const [imgLoading, setImgLoading] = useState(false);
  const { disableAutoSelect } = (history.location as any).query || {};
  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      callback(reader.result as string);
    });
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: RcFile) => {
    setImgLoading(true);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(
        intl.formatMessage({ id: 'You can only upload JPG/PNG file!' }),
      );
    }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error(
        intl.formatMessage({ id: 'Image must smaller than 20MB!' }),
      );
    }
    console.log(file);
    getBase64(file as RcFile, (url) => {
      setImgLoading(false);
      setImgUrl(url);
    });
    return isJpgOrPng && isLt20M;
  };
  const selectStore = async (storeInfo: SYSTEM.StoreListInfo) => {
    if (!storeInfo) {
      return;
    }
    Cookie.set('storeId', storeInfo.storeId);
    await services.UserController.bindPmsStoreToken();
    refresh();
    history.replace('/');
  };
  const { data, run, loading } = useRequest(() => {
    return services.UserController.getPmsStoreList().then((res) => {
      if (res.data?.list?.length === 1) {
        if (!disableAutoSelect) {
          selectStore(res.data?.list?.[0]);
        }
      }
      return res;
    });
  });
  const createStoreModal = (
    <ModalForm<Partial<SYSTEM.ShopDetail>>
      title={intl.formatMessage({ id: '添加门店' })}
      trigger={
        <Button type="primary">{intl.formatMessage({ id: '添加门店' })}</Button>
      }
      autoFocusFirstInput
      modalProps={{
        width: 600,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        await services.UserController.newPmsStore({
          ...values,
          cover: imgUrl,
        });
        run();
        return true;
      }}
      layout="horizontal"
      preserve={false}
      {...formItemLayout}
    >
      <ProForm.Item
        name="cover"
        label={intl.formatMessage({ id: '门店图片' })}
        rules={[{ required: true }]}
      >
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          {imgUrl ? (
            <img src={imgUrl} alt="avatar" style={{ width: '100%' }} />
          ) : (
            <div>
              {imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </ProForm.Item>
      <ProFormText
        name="name"
        label={intl.formatMessage({ id: '门店名称' })}
        fieldProps={{
          maxLength: 20,
        }}
        rules={[{ required: true }, { whitespace: true }]}
      />
      <ProFormText
        name="code"
        label={intl.formatMessage({ id: '门店编号' })}
        rules={[{ required: true }]}
        fieldProps={{
          maxLength: 30,
        }}
      />
      <ProFormRadio.Group
        label={intl.formatMessage({ id: '门店类型' })}
        name="type"
        initialValue={1}
        options={[
          { label: intl.formatMessage({ id: '⺠宿' }), value: 1 },
          { label: intl.formatMessage({ id: '其他' }), value: 2 },
        ]}
      />
      <ProFormSelect
        label={intl.formatMessage({ id: '时区' })}
        name="timezone"
        rules={[{ required: true }]}
        initialValue={-(new Date().getTimezoneOffset() / 60)}
        request={async () => {
          return services.UserController.getTimezone().then((res) => {
            return res.data.map((item) => {
              return {
                label: item.desc,
                value: item.timezone,
              };
            });
          });
        }}
      />
      <ProFormText
        name="address"
        label={intl.formatMessage({ id: '一级地址' })}
        rules={[{ required: true }]}
      />
      <ProFormText
        name="detailAddress"
        label={intl.formatMessage({ id: '详细地址' })}
      />
      <ProFormText
        name="bossName"
        label={intl.formatMessage({ id: '负责人姓名' })}
        rules={[{ required: true }]}
        fieldProps={{
          maxLength: 30,
        }}
      />
      <ProFormText
        name="bossEmail"
        label={intl.formatMessage({ id: '负责人邮箱' })}
        initialValue={Cookie.get('emailAddress')}
        rules={[
          {
            type: 'email',
            message: intl.formatMessage({ id: '邮箱格式不正确' }),
          },
        ]}
        hidden
      />
      <ProFormText
        name="bossPhoneNo"
        label={intl.formatMessage({ id: '门店座机' })}
        fieldProps={{
          maxLength: 30,
        }}
      />
      <ProFormText
        name="activationCode"
        label={intl.formatMessage({ id: '激活码' })}
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
  if (loading) {
    return <Spin />;
  }
  if (!data?.list?.length) {
    return (
      <div className="store-welcome">
        <ProCard className="store-welcome-left">
          <div>
            <img src={logo} />
          </div>
          <div>{intl.formatMessage({ id: '基于云服务的酒店PMS' })}</div>
          <div>
            {intl.formatMessage({
              id: '告别传统的线下部署，云端服务让您的数据更加安全，工作更高效！',
            })}
          </div>
          <div>
            {intl.formatMessage({
              id: 'PieTable支持与各大OTA平台直连和半直连，轻松管理订单来源！',
            })}
          </div>
          <div>
            {intl.formatMessage({
              id: '极简的操作设计，让您的管理工作简约不简单！',
            })}
          </div>
          <div>
            {intl.formatMessage({
              id: '提供专属技术客服，随时解决您的一切问题！',
            })}
          </div>
          <div>
            {intl.formatMessage({
              id: '配套移动端App应用，让您随时随地处理房间与订单！',
            })}
          </div>
          <div>
            {intl.formatMessage({ id: '请创建您的第一家酒店，开始体验吧！' })}
          </div>
          <div>{createStoreModal}</div>
        </ProCard>
        <ProCard className="store-welcome-right">
          <div>{intl.formatMessage({ id: '您名下至少有一家酒店' })}</div>
          <br />
          <div>
            {intl.formatMessage({ id: '首次创建时您需要填入以下必填资料' })}
          </div>
          <br />
          <div>
            <span className="store-welcome-right-label">
              {intl.formatMessage({ id: '酒店名称' })}
            </span>{' '}
            {intl.formatMessage({
              id: '必填项，您可以随意填写，方便自己多个民宿酒店区分即可。',
            })}
          </div>
          <br />
          <div>
            <span className="store-welcome-right-label">
              {intl.formatMessage({ id: '时区' })}
            </span>{' '}
            {intl.formatMessage({
              id: '必填项，为了照顾您多酒店的时区问题，每家酒店可以独立设置时区',
            })}
          </div>
          <br />
          <div>
            <span className="store-welcome-right-label">
              {intl.formatMessage({ id: '酒店地址' })}
            </span>{' '}
            {intl.formatMessage({ id: '必填项，尽量详细的地址' })}
          </div>
          <br />
          <div>
            <span className="store-welcome-right-label">
              {intl.formatMessage({ id: '激活码' })}
            </span>{' '}
            {intl.formatMessage({ id: '必填项，有PieTable的工作人员为您提供' })}
          </div>
        </ProCard>
      </div>
    );
  }
  return (
    <PageContainer
      ghost
      header={{
        title: intl.formatMessage({ id: '门店列表' }),
        subTitle: createStoreModal,
      }}
      style={{ minHeight: '100vh' }}
    >
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space wrap size={[12, 12]}>
            {data?.list?.map((store) => {
              return (
                <Card
                  key={store.storeId}
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      style={{ width: 240, height: 285 }}
                      src={store.cover || storeDefaultCover}
                    />
                  }
                >
                  <Card.Meta
                    title={store.storeName}
                    description={
                      <>
                        <div>{intl.formatMessage({ id: '到期时间' })}：</div>
                        <div>{store.expirationTime}</div>
                        <Button
                          onClick={() => selectStore(store)}
                          style={{ width: '100%', marginTop: 12 }}
                        >
                          {intl.formatMessage({ id: '进入酒店' })}
                        </Button>
                      </>
                    }
                  />
                </Card>
              );
            })}
          </Space>
        </Col>
      </Row>
    </PageContainer>
  );
}
