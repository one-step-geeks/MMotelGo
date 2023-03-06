import React, { useState } from 'react';
import { message, Space, Form, Typography, InputNumber, Input } from 'antd';
import { DrawerForm, ProFormDateRangePicker } from '@ant-design/pro-form';
import type { ActionType } from '@ant-design/pro-table';
import moment from 'moment';
import services from '@/services';
import { useIntl } from 'umi';

const FormItem = Form.Item;

interface Props {
  record?: SETTING.RoomPriceListData;
  date?: string;
  showRemain?: boolean;
  priceType?: number;
  action?: ActionType;
}

const PriceEditDrawer: React.FC<Props> = (props) => {
  const { record, showRemain, date, priceType, action } = props;
  const [visible, setVisible] = useState(false);
  const intl = useIntl();

  const data = record?.dateList?.find((item) =>
    moment(item.date).isSame(date, 'd'),
  );

  function localeRender(count?: number | string) {
    const translated = intl.formatMessage({ id: '剩' });
    if (intl.locale == 'en-US') {
      return `${count} ${translated}`;
    } else {
      return `${translated}${count}`;
    }
  }

  return (
    <DrawerForm
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      width={480}
      visible={visible}
      onVisibleChange={setVisible}
      trigger={
        <Space
          direction="vertical"
          size={[0, 0]}
          style={{ width: '100%', cursor: 'pointer' }}
        >
          {data?.price}
          {showRemain || true ? (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {localeRender(data?.remainCount)}
            </Typography.Text>
          ) : null}
        </Space>
      }
      preserve={false}
      drawerProps={{
        closable: false,
        maskClosable: false,
        destroyOnClose: true,
      }}
      layout="horizontal"
      title={intl.formatMessage({ id: '修改价格' })}
      onFinish={async (values) => {
        try {
          await services.SettingController.updateRoomPrice({
            ...values,
            startTime: values?.dateRange?.[0],
            endTime: values?.dateRange?.[1],
          });
          action?.reload();
          message.success('设置成功！');
        } catch (error) {}
        return true;
      }}
    >
      <FormItem label={intl.formatMessage({ id: '本地房型' })}>
        <Typography.Text type="secondary">
          {record?.roomTypeName}
        </Typography.Text>
      </FormItem>
      <FormItem name="roomTypeId" hidden initialValue={record?.roomTypeId}>
        <Input />
      </FormItem>
      <FormItem name="priceType" hidden initialValue={priceType}>
        <Input />
      </FormItem>
      <ProFormDateRangePicker
        label={intl.formatMessage({ id: '改价日期' })}
        name="dateRange"
        rules={[{ required: true }]}
        fieldProps={{ style: { width: '100%' } }}
        initialValue={[date, date]}
      />
      <FormItem
        label={intl.formatMessage({ id: '门市价' })}
        rules={[{ required: true }]}
        name="price"
        initialValue={data?.price}
      >
        <InputNumber
          style={{ width: '100%' }}
          max={100000000}
          precision={2}
          maxLength={8}
        />
      </FormItem>
    </DrawerForm>
  );
};

export default PriceEditDrawer;
