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
  const [consumeId, setConsumeId] = useState<number | undefined>();

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
          if (notice?.id) {
            await services.OrderController.updateConsume({
              ...values,
              id: notice?.id,
            });
            message.success('修改成功');
          } else {
            await services.OrderController.addConsume(values);
            message.success('添加成功');
          }
          setVisible(false);
          form.resetFields();
          onSuccess();
          return true;
        } catch (err) {}
      }}
    >
      <ProFormSelect
        colProps={{ md: 12 }}
        label="项目"
        rules={[{ required: true, message: '请选择项目' }]}
        name="consumptionSetId"
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
        name="remindTime"
        placeholder="请选择消费时间"
        label="消费时间"
      />
      <ProFormTextArea
        name="remark"
        label="消费备注"
        placeholder="请输入消费备注"
      />
    </DrawerForm>
  );

  const openConsumeDrawer = (
    consumeId: number,
    notice?: ORDER.OrderConsume,
  ) => {
    setConsumeId(consumeId);
    setVisible(true);
    setConsume(notice);
  };

  return { ConsumeDrawer, openConsumeDrawer };
}
