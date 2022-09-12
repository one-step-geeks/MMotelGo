import { Button } from 'antd';
import { useIntl } from 'umi';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm } from '@ant-design/pro-components';
import services from '@/services';

type TableListItem = Partial<ROOM_STATE.StateChangeLog>;

interface Props {}

export default (props: Props) => {
  const intl = useIntl();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: intl.formatMessage({ id: '房型名称' }),
      width: 120,
      dataIndex: 'roomTypeName',
    },
    {
      title: intl.formatMessage({ id: '房间号' }),
      width: 120,
      dataIndex: 'roomCode',
    },
    {
      title: '操作内容',
      width: 80,
      dataIndex: 'operationDesc',
    },
    {
      title: '开始/结束时间',
      width: 180,
      dataIndex: 'startTime',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({ id: '备注' }),
      width: 120,
      ellipsis: true,
      dataIndex: 'remark',
    },
    {
      title: intl.formatMessage({ id: '操作人' }),
      width: 100,
      dataIndex: 'operator',
    },
    {
      title: intl.formatMessage({ id: '操作时间' }),
      width: 180,
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];
  return (
    <ModalForm
      width={1000}
      layout="horizontal"
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
      />
    </ModalForm>
  );
};
