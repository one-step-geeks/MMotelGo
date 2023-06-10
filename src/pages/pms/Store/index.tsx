import { Space, Card, Button, Row, Col } from 'antd';
import { useModel, useRequest } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-form';
import Cookie from 'js-cookie';
import { useHistory } from 'umi';
import services from '@/services';
import { useIntl } from 'umi';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function StorePage() {
  const history = useHistory();
  const { refresh } = useModel('@@initialState');
  const intl = useIntl();
  const selectStore = async (storeInfo: SYSTEM.StoreListInfo) => {
    if (!storeInfo) {
      return;
    }
    Cookie.set('storeId', storeInfo.storeId);
    await services.UserController.bindPmsStoreToken();
    refresh();
    history.replace('/');
  };
  const { data, run } = useRequest(() => {
    return services.UserController.getPmsStoreList().then((res) => {
      if (res.data?.list?.length === 1) {
        selectStore(res.data?.list?.[0]);
      }
      return res;
    });
  });

  return (
    <PageContainer
      ghost
      header={{
        title: intl.formatMessage({ id: '门店列表' }),
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
                  onClick={() => selectStore(store)}
                >
                  <Card.Meta
                    title={store.storeName}
                    description={
                      <>
                        {intl.formatMessage({ id: '到期时间' })}：
                        {store.expirationTime}
                      </>
                    }
                  />
                </Card>
              );
            })}
          </Space>
        </Col>
        <Col>
          <ModalForm<Partial<SYSTEM.ShopDetail>>
            title={intl.formatMessage({ id: '添加门店' })}
            trigger={
              <Button type="primary">
                {intl.formatMessage({ id: '添加门店' })}
              </Button>
            }
            autoFocusFirstInput
            modalProps={{
              width: 600,
              destroyOnClose: true,
            }}
            onFinish={async (values) => {
              await services.UserController.newPmsStore(values);
              run();
              return true;
            }}
            layout="horizontal"
            preserve={false}
            {...formItemLayout}
          >
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
        </Col>
      </Row>
    </PageContainer>
  );
}
