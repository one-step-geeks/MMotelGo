import { useState } from 'react';
import { Button, Form, message, Modal, Space, InputNumber } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { ConsumerItemClassifyEnum } from '@/constants';
import { useIntl } from 'umi';
import services from '@/services';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState<ActionType>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [consumer, setConsumer] = useState<Partial<SETTING.ConsumerItem>>();

  const isUpdate = !!consumer;

  async function onSubmit() {
    try {
      const data = await form.validateFields();
      setSubmitLoading(true);
      await services.SettingController.addConsumerItem(
        {
          id: consumer?.id,
          ...data,
        },
        isUpdate ? 'update' : 'add',
      );
      message.success(
        intl.formatMessage({ id: `${isUpdate ? '保存' : '添加'}成功` }),
      );
      setVisible(false);
      setConsumer(undefined);
      action?.reload();
    } catch (error) {
    } finally {
      setSubmitLoading(false);
    }
  }

  function openAddConsumerItemModal(
    act?: ActionType,
    record?: Partial<SETTING.ConsumerItem>,
  ) {
    setConsumer(record);
    setAction(act);
    setVisible(true);
  }

  const addConsumerItemModal = (
    <Modal
      width={600}
      onCancel={() => setVisible(false)}
      visible={visible}
      title={intl.formatMessage({ id: isUpdate ? '编辑消费项' : '添加消费项' })}
      footer={
        <Space>
          <Button onClick={() => setVisible(false)}>
            {intl.formatMessage({ id: '取消' })}
          </Button>
          <Button type="primary" onClick={onSubmit} loading={submitLoading}>
            {intl.formatMessage({ id: isUpdate ? '保存' : '添加' })}
          </Button>
        </Space>
      }
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        {...formItemLayout}
        preserve={false}
        layout="horizontal"
      >
        <ProFormSelect
          name="classify"
          label={intl.formatMessage({ id: '消费项分类' })}
          rules={[{ required: true, message: '请选择分类' }]}
          initialValue={consumer?.classify}
          options={[
            {
              label: intl.formatMessage({ id: '早餐消费' }),
              value: ConsumerItemClassifyEnum.BREAKFAST,
            },
            {
              label: intl.formatMessage({ id: '客房消费' }),
              value: ConsumerItemClassifyEnum.ROOM_CONSUMPTION,
            },
            {
              label: intl.formatMessage({ id: '赔偿' }),
              value: ConsumerItemClassifyEnum.COMPENSATION,
            },
            {
              label: intl.formatMessage({ id: '其他' }),
              value: ConsumerItemClassifyEnum.OTHER,
            },
          ]}
        />
        <ProFormText
          label={intl.formatMessage({ id: '名称' })}
          name="name"
          fieldProps={{
            maxLength: 20,
          }}
          // rules={[{ required: true, message: '请输入名称' }]}
          initialValue={consumer?.name}
        />
        <FormItem
          label={intl.formatMessage({ id: '价格' })}
          name="price"
          initialValue={consumer?.price}
          // rules={[{ required: true, message: '请输入价格' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            addonBefore={intl.formatMessage({ id: '￥' })}
            precision={2}
          />
        </FormItem>
      </Form>
    </Modal>
  );

  return {
    addConsumerItemModal,
    openAddConsumerItemModal,
  };
};
