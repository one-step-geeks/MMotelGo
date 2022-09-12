import React, { useState } from 'react';
import { Button, Space, DatePicker, Typography } from 'antd';
import { useIntl } from 'umi';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm } from '@ant-design/pro-components';
import { getWeekDay, getCalendarDate } from '@/utils';
import services from '@/services';
import moment from 'moment';

type TableListItem = Partial<ROOM_STATE.StateChangeLog>;

interface Props {}

export default (props: Props) => {
  const intl = useIntl();
  const [fromDate, setFromDate] = useState(() => moment());

  function getCalendarColumns() {
    const calendarList = getCalendarDate(7, fromDate);

    return (
      calendarList?.map?.((item) => {
        const d = moment(item.date);
        const isWeekend = [0, 6].includes(d.day());
        const textType = isWeekend ? 'danger' : undefined;
        return {
          title: (
            <Space direction="vertical" size={[0, 0]}>
              <Space>
                <Typography.Text type={textType}>
                  {d.format('MM-DD')}
                </Typography.Text>
                <Typography.Text type={textType}>
                  {getWeekDay(d)}
                </Typography.Text>
              </Space>
            </Space>
          ),
          align: 'center' as 'left' | 'center' | 'right',
          children: [
            {
              align: 'center',
              title: intl.formatMessage({ id: '可售' }),
              width: 80,
            },
            {
              align: 'center',
              title: intl.formatMessage({ id: '占用' }),
              width: 80,
            },
            {
              align: 'center',
              title: intl.formatMessage({ id: '不可售' }),
              width: 80,
            },
          ],
        };
      }) || []
    );
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: intl.formatMessage({ id: '房型' }),
      width: 160,
      dataIndex: 'roomTypeName',
      align: 'center',
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: '数量' }),
      width: 80,
      dataIndex: 'roomCode',
      align: 'center',
      fixed: 'left',
    },
    ...getCalendarColumns(),
  ];

  return (
    <ModalForm
      width={1000}
      layout="horizontal"
      size="small"
      modalProps={{
        maskClosable: false,
        destroyOnClose: true,
      }}
      title={intl.formatMessage({ id: '房情表' })}
      trigger={<Button>{intl.formatMessage({ id: '房情表' })}</Button>}
      onFinish={async () => {
        return true;
      }}
    >
      <ProTable<TableListItem>
        bordered
        scroll={{ x: 'scroll' }}
        form={{ component: false }}
        tableAlertRender={false}
        columns={columns}
        request={async (params) => {
          const { data } = await services.RoomStateController.getRoomSituation(
            params,
          );
          const { list, totalCount } = data;
          return {
            data: list,
            success: true,
            total: totalCount,
          };
        }}
        search={false}
        options={false}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        headerTitle={
          <Space>
            <DatePicker
              size="middle"
              value={fromDate}
              onChange={(date) => setFromDate(date!)}
              style={{ width: 140 }}
              allowClear={false}
            />
          </Space>
        }
      />
    </ModalForm>
  );
};
