import { Button, Typography, Switch, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { InlineErrorFormItem, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import useAddConsumerItemModal from './components/AddConsumerItemModal';
import { ConsumerItemClassifyEnum } from '@/constants';
import { useIntl } from 'umi';
import services from '@/services';

const { Link } = Typography;

type TableListItem = Partial<SETTING.ConsumerItem>;

export default () => {
  const intl = useIntl();
  const { openAddConsumerItemModal, addConsumerItemModal } =
    useAddConsumerItemModal();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: intl.formatMessage({ id: '分类' }),
      dataIndex: 'classify',
      valueEnum: {
        [ConsumerItemClassifyEnum.BREAKFAST]: intl.formatMessage({
          id: '早餐消费',
        }),
        [ConsumerItemClassifyEnum.ROOM_CONSUMPTION]: intl.formatMessage({
          id: '客房消费',
        }),
        [ConsumerItemClassifyEnum.COMPENSATION]: intl.formatMessage({
          id: '赔偿',
        }),
        [ConsumerItemClassifyEnum.OTHER]: intl.formatMessage({ id: '其他' }),
      },
    },
    {
      title: intl.formatMessage({ id: '消费项名称' }),
      ellipsis: true,
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: '价格' }),
      width: 120,
      dataIndex: 'price',
    },
    {
      title: intl.formatMessage({ id: '状态' }),
      width: 160,
      dataIndex: 'status',
      render: (_, record) => {
        return (
          <Switch
            defaultChecked={record.status === 1}
            onChange={async (checked) => {
              try {
                await services.SettingController.setConsumerItemStatus({
                  id: record.id,
                  status: checked ? 1 : 0,
                });
                message.success(intl.formatMessage({ id: '操作成功' }));
              } catch (error) {
                message.error(intl.formatMessage({ id: '操作失败' }));
              }
            }}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: '操作' }),
      fixed: 'right',
      width: 140,
      key: 'option',
      valueType: 'option',
      render: (_text, record, _, action) => {
        const deleteConsumerItem = async () => {
          try {
            await services.SettingController.deleteConsumerItem({
              id: record.id,
            });
            message.success(intl.formatMessage({ id: '删除成功' }));
            action?.reload();
          } catch (error) {}
        };
        return [
          <Link
            key="edit"
            onClick={() => {
              openAddConsumerItemModal(action, record);
            }}
          >
            {intl.formatMessage({ id: '编辑' })}
          </Link>,
          <Popconfirm
            key="status"
            placement="topRight"
            title={intl.formatMessage({ id: '此操作将永久删除, 是否继续？' })}
            onConfirm={deleteConsumerItem}
          >
            <Link>{intl.formatMessage({ id: '删除' })}</Link>
          </Popconfirm>,
        ];
      },
    },
  ];

  return (
    <>
      <ProTable<TableListItem>
        size="large"
        scroll={{ x: 'scroll' }}
        columns={columns}
        request={async (params) => {
          const { data } = await services.SettingController.getConsumerItemList(
            params,
          );
          const { list, total } = data || {};
          return {
            total,
            data: list || [],
          };
        }}
        options={false}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        search={false}
        toolBarRender={(action) => [
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              openAddConsumerItemModal(action);
            }}
          >
            {intl.formatMessage({ id: '添加消费项' })}
          </Button>,
        ]}
      />
      {addConsumerItemModal}
    </>
  );
};
