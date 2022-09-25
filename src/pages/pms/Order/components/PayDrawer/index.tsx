import { ArrowLeftOutlined } from '@ant-design/icons';
import services from '@/services';
import {
  DrawerForm,
  ProFormDatePicker,
  ProFormText,
  ProFormDigit,
  ProFormDateTimePicker,
  ProFormTextArea,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-components';
import { message, Tabs, Input, Space, Form, Checkbox, Button } from 'antd';
import { useEffect, useState } from 'react';
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
  const [form] = Form.useForm<FormOrder>();
  const [orderId, setOrderId] = useState<number | undefined>();
  const [payType, setPayType] = useState('pay');
  const [visible, setVisible] = useState(false);
  const PayOrRefundDrawer = (
    <DrawerForm
      title="添加收退款"
      form={form}
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
        width: 540,

        closeIcon: (
          <>
            <Space>
              <ArrowLeftOutlined />
              返回
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
          await services.OrderController.addPayOrRefund({
            orderId,
            ...values,
          });
          message.success('添加成功');
          setVisible(false);
          form.resetFields();
          onSuccess();
          return true;
        } catch (err) {}
      }}
    >
      <Tabs
        defaultActiveKey={payType}
        onChange={(value) => {
          setPayType(value);
          form.setFieldsValue({
            type: value === 'pay' ? 1 : 3,
          });
        }}
      >
        <Tabs.TabPane tab="收款" key="pay" />
        <Tabs.TabPane tab="退款" key="refund" />
      </Tabs>

      <ProFormRadio.Group
        name="type"
        label="项目"
        options={
          payType === 'pay'
            ? payOrRefundOptions.slice(0, 2)
            : payOrRefundOptions.slice(2)
        }
      />

      <ProFormSelect
        label="支付方式"
        rules={[{ required: true, message: '请选择支付方式' }]}
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
        rules={[{ required: true, message: '请输入金额' }]}
        label="金额"
        name="amount"
        placeholder="请输入金额"
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
        placeholder="请选择消费时间"
        label="日期"
      />

      <ProFormTextArea name="remark" label="备注" placeholder="请输入备注" />
    </DrawerForm>
  );

  const openPayOrRefundDrawer = (orderId: number) => {
    setOrderId(orderId);
    setVisible(true);
  };

  return { PayOrRefundDrawer, openPayOrRefundDrawer };
}
