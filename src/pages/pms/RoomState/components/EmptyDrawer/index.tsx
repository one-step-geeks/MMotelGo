import React, { useState } from 'react';
import { message, Form } from 'antd';
import { DrawerForm } from '@ant-design/pro-form';
import EmptyBox from './EmptyBox';
import services from '@/services';
import { useIntl } from 'umi';

const FormItem = Form.Item;

interface Props {
  record: ROOM_STATE.StateTableData;
  date: string;
}

const EmptyDrawer: React.FC<Props> = (props) => {
  const { date, record } = props;
  const [visible, setVisible] = useState(false);
  const intl = useIntl();
  return (
    <DrawerForm
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      width={800}
      visible={visible}
      onVisibleChange={setVisible}
      trigger={<EmptyBox record={record} date={date} />}
      drawerProps={{
        closable: false,
        maskClosable: false,
      }}
      layout="horizontal"
      title={intl.formatMessage({ id: '订单详情' })}
      onFinish={async (values) => {
        try {
          await services.SettingController.updateRoomPrice({
            ...values,
            startTime: values?.dateRange?.[0],
            endTime: values?.dateRange?.[1],
          });
          message.success(intl.formatMessage({ id: '设置成功' }));
        } catch (error) {}
        return true;
      }}
    >
      {date}
    </DrawerForm>
  );
};

export default EmptyDrawer;
