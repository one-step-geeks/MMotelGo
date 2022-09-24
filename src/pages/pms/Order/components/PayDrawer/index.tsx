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
} from '@ant-design/pro-components';
import { message, Tabs, Input, Space, Form, Checkbox, Button } from 'antd';
import { useEffect, useState } from 'react';
import './style.less';

interface FormOrder {}

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
      autoFocusFirstInput
      visible={visible}
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
          // if (notice?.id) {
          //   await services.OrderController.updatePay({
          //     ...values,
          //     id: notice?.id,
          //   });`
          //   message.success('修改成功');
          // } else {
          await services.OrderController.addPayOrRefund({
            type: payType === 'pay' ? 1 : 3,
            orderId,
            ...values,
          });
          message.success('添加成功');
          // }
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
        }}
      >
        <Tabs.TabPane tab="收款" key="pay" />
        <Tabs.TabPane tab="退款" key="refund" />
      </Tabs>

      <ProFormSelect
        colProps={{ md: 12 }}
        label="支付方式"
        rules={[{ required: true, message: '请选择支付方式' }]}
        name="paymentTypeId"
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