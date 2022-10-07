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
import { message, Input, Space, Form, Checkbox, Button } from 'antd';
import { useEffect, useState } from 'react';

interface FormOrder {}

export function useConsumeDrawer(onSuccess: () => void) {
  const [form] = Form.useForm<FormOrder>();
  const [visible, setVisible] = useState(false);
  const [notice, setConsume] = useState<ORDER.OrderConsume | undefined>();
  const [orderId, setOrderId] = useState<number | undefined>();

  useEffect(() => {
    if (notice) {
      form.setFieldsValue(notice);
    }
  }, [notice]);

  const ConsumeDrawer = (
    <DrawerForm
      title={notice?.id ? '修改消费项' : '添加消费项'}
      form={form}
      layout="horizontal"
      grid
      autoFocusFirstInput
      visible={visible}
      labelCol={{
        md: 4,
      }}
      drawerProps={{
        width: 640,
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
          const { consumptionSetId, ...rest } = values;
          await services.OrderController.addConsume({
            orderId,
            consumptionSetId: consumptionSetId.value,
            consumptionSetName: consumptionSetId.label,
            ...rest,
          });
          message.success('添加成功');
          setVisible(false);
          form.resetFields();
          onSuccess();
          return true;
        } catch (err) {}
      }}
    >
      <ProFormSelect
        label="项目"
        rules={[{ required: true, message: '请选择项目' }]}
        name="consumptionSetId"
        fieldProps={{
          labelInValue: true,
        }}
        request={async () => {
          const { data } = await services.SettingController.getConsumerItemList(
            {
              current: 1,
              pageSize: 100,
            },
          );
          const { list } = data || {};
          return list?.map((row) => ({
            label: row.name,
            value: row.id,
          }));
        }}
      />

      {/* <Form.Item name='consumptionSetName' noStyle/> */}

      <ProFormText
        rules={[{ required: true, message: '请输入数量' }]}
        name="count"
        label="数量"
        placeholder="请输入数量"
      />

      <ProFormDigit
        rules={[{ required: true, message: '请输入金额' }]}
        label="金额"
        name="price"
        placeholder="请输入金额"
      />

      <ProFormDatePicker
        name="consumeDate"
        placeholder="请选择消费时间"
        label="消费时间"
      />
      <ProFormTextArea
        name="remark"
        label="消费备注"
        fieldProps={{
          maxLength: 200,
          showCount: true,
        }}
        placeholder="请输入消费备注"
      />
    </DrawerForm>
  );

  const openConsumeDrawer = (orderId: number, notice?: ORDER.OrderConsume) => {
    setOrderId(orderId);
    setVisible(true);
    setConsume(notice);
  };

  return { ConsumeDrawer, openConsumeDrawer };
}
