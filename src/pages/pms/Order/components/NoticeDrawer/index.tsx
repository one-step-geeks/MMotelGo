import { ArrowLeftOutlined } from '@ant-design/icons';
import services from '@/services';
import moment from 'moment';
import { useIntl } from 'umi';
import {
  DrawerForm,
  ProFormDateTimePicker,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message, Input, Space, Form, Checkbox, Button } from 'antd';
import { useEffect, useState } from 'react';

interface FormOrder {}

export function useNoticeDrawer(onSuccess: () => void) {
  const intl = useIntl();
  const [form] = Form.useForm<FormOrder>();
  const [visible, setVisible] = useState(false);
  const [notice, setNotice] = useState<ORDER.OrderNotice | undefined>();
  const [orderId, setOrderId] = useState<number | undefined>();

  useEffect(() => {
    if (notice) {
      form.setFieldsValue(notice);
    }
  }, [notice]);

  const NoticeDrawer = (
    <DrawerForm
      title={intl.formatMessage({ id: notice?.id ? '修改提醒' : '添加提醒' })}
      form={form}
      layout="horizontal"
      grid
      className="order-notice-drawer"
      autoFocusFirstInput
      visible={visible}
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
          const { remindTime, remark } = values;
          const formattedRemindTime = moment(remindTime).format(
            'YYYY-MM-DD HH:mm:ss',
          );
          if (notice?.id) {
            await services.OrderController.updateNotice({
              id: notice?.id,
              remindTime: formattedRemindTime,
              remark,
            });
            message.success(intl.formatMessage({ id: '修改成功' }));
          } else {
            await services.OrderController.addNotice({
              orderId,
              remindTime: formattedRemindTime,
              remark,
            });
            message.success(intl.formatMessage({ id: '添加成功' }));
          }
          setVisible(false);
          form.resetFields();
          onSuccess();
          return true;
        } catch (err) {}
      }}
    >
      <ProFormDateTimePicker
        // rules={[{ required: true, message: '请选择提醒时间' }]}
        name="remindTime"
        // placeholder="请选择提醒时间"
        label={intl.formatMessage({ id: '提醒时间' })}
        fieldProps={{ format: 'MM/DD/YYYY HH:mm:ss' }}
      />
      <ProFormTextArea
        // rules={[{ required: true, message: '请输入提醒内容' }]}
        name="remark"
        label={intl.formatMessage({ id: '提醒内容' })}
        // placeholder="请输入提醒内容"
        fieldProps={{
          maxLength: 200,
          showCount: true,
        }}
      />
    </DrawerForm>
  );

  const openNoticeDrawer = (orderId: number, notice?: ORDER.OrderNotice) => {
    setOrderId(orderId);
    setVisible(true);
    setNotice(notice);
  };

  return { NoticeDrawer, openNoticeDrawer };
}
