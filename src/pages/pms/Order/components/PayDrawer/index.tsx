import { ArrowLeftOutlined } from '@ant-design/icons';
import services from '@/services';
import moment from 'moment';
import { useIntl } from 'umi';
import {
  DrawerForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormTextArea,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-components';
import { message, Tabs, Space, Form } from 'antd';
import { useState } from 'react';
import './style.less';

interface FormOrder {}

export const payOrRefundOptions = [
  {
    label: '收款',
    value: 1,
  },
  {
    label: '收押金',
    value: 2,
  },
  {
    label: '退款',
    value: 3,
  },
  {
    label: '退押金',
    value: 4,
  },
];

export function usePayOrRefundDrawer(onSuccess: () => void) {
  const intl = useIntl();
  const [form] = Form.useForm<FormOrder>();
  const [orderId, setOrderId] = useState<number | undefined>();
  const [payType, setPayType] = useState('pay');
  const [visible, setVisible] = useState(false);
  const PayOrRefundDrawer = (
    <DrawerForm
      title={intl.formatMessage({ id: '添加收退款' })}
      form={form}
      className="order-pay-drawer"
      layout="horizontal"
      grid
      labelCol={{
        md: 4,
      }}
      autoFocusFirstInput
      visible={visible}
      initialValues={{
        type: 1,
      }}
      drawerProps={{
        width: 640,
        closeIcon: (
          <>
            <Space>
              <ArrowLeftOutlined />
              {intl.formatMessage({ id: '返回' })}
            </Space>
          </>
        ),
        destroyOnClose: true,
        maskClosable: false,
        onClose: () => {
          form.resetFields();
          setVisible(false);
        },
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        try {
          const { feeDate, ...rest } = values;
          await services.OrderController.addPayOrRefund({
            orderId,
            feeDate: moment(feeDate).format('YYYY-MM-DD'),
            ...rest,
          });
          message.success(intl.formatMessage({ id: '添加成功' }));
          setVisible(false);
          form.resetFields();
          onSuccess();
          return true;
        } catch (err) {}
      }}
    >
      <Tabs
        activeKey={payType}
        onChange={(value) => {
          setPayType(value);
          form.setFieldsValue({
            type: value === 'pay' ? 1 : 3,
          });
        }}
      >
        <Tabs.TabPane tab={intl.formatMessage({ id: '收款' })} key="pay" />
        <Tabs.TabPane tab={intl.formatMessage({ id: '退款' })} key="refund" />
      </Tabs>

      <ProFormRadio.Group
        name="type"
        label={intl.formatMessage({ id: '项目' })}
        options={
          payType === 'pay'
            ? payOrRefundOptions.slice(0, 2)
            : payOrRefundOptions.slice(2)
        }
      />

      <ProFormSelect
        label={intl.formatMessage({ id: '支付方式' })}
        // , message: '请选择支付方式'
        rules={[{ required: true }]}
        name="feeConfigId"
        request={async () => {
          const { data } = await services.FinanceController.queryPaymentTypes();
          return data?.map((row) => ({
            label: row.name,
            value: row.id,
          }));
        }}
      />

      <ProFormDigit
        // , message: '请输入金额'
        rules={[{ required: true }]}
        label={intl.formatMessage({ id: '金额' })}
        name="amount"
        // placeholder="请输入金额"
      />
      {/* 
      <ProFormText
        rules={[{ required: true, message: '请输入数量' }]}
        name="count"
        label="数量"
        placeholder="请输入数量"
      /> */}

      <ProFormDatePicker
        name="feeDate"
        fieldProps={{ format: 'MM/DD/YYYY' }}
        // placeholder="请选择日期"
        label={intl.formatMessage({ id: '日期' })}
      />

      <ProFormTextArea
        fieldProps={{
          maxLength: 200,
          showCount: true,
        }}
        name="remark"
        label={intl.formatMessage({ id: '备注' })}
        // placeholder="请输入备注"
      />
    </DrawerForm>
  );

  const openPayOrRefundDrawer = (orderId: number) => {
    setOrderId(orderId);
    setVisible(true);
    setPayType('pay');
  };

  return { PayOrRefundDrawer, openPayOrRefundDrawer };
}
