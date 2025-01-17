import React, { useState, useEffect, useRef } from 'react';
import { Pagination, message, Radio, Button, Input, Space, Select } from 'antd';
import {
  ProTable,
  ProFormDateRangePicker,
  ProFormInstance,
} from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { useRequest, useLocation, useIntl } from 'umi';
import services from '@/services';
import { bufferDownload } from '@/utils';
import { OrderStateOptions, OrderPayOptions } from '@/services/OrderController';
import { useOrderDetailDrawer } from '../components/OrderDetailDrawer';
import OrderFormDrawer from '../components/OrderFormDrawer';
import classNames from 'classnames';

import './style.less';

const { Option } = Select;

const convertOptionToEnums = (options: Array<SETTING.Option>) => {
  const enums: Record<number, object> = {};
  options.forEach(({ value, label }) => {
    enums[value] = { text: label };
  });
  return enums;
};

enum QueryType {
  ALL = 1,
  TODAY_ARRIVE,
  TODAY_LEAVE,
  TODAY_CREAYED,
  NOT_ARRANGED,
}
interface QueryParam {
  queryType?: QueryType;
  dateType: DateType;
  keyword?: string;
  searchType?: string;
}

enum DateType {
  checkInDate = 1,
  checkOutDate,
  createDate,
}
const OrderContainer: React.FC = (props) => {
  const intl = useIntl();
  const location = useLocation();
  const isNotArranged = location.pathname === '/pms/order/unarrange';
  const ref = useRef<ProFormInstance>();
  const [param, setParam] = useState<QueryParam>({
    dateType: DateType.checkInDate,
    queryType: isNotArranged ? QueryType.NOT_ARRANGED : QueryType.ALL,
    searchType: 'channelOrderNo',
  });
  const [roomTypeOptions, setRoomTypeOptions] = useState<Array<SETTING.Option>>(
    [],
  );
  const [channelOptions, setChannelOptions] = useState<Array<SETTING.Option>>(
    [],
  );
  const [orderId, setOrderId] = useState<number | undefined>();
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const { OrderDetailDrawer, openOrderDetailDrawer } = useOrderDetailDrawer(
    () => {
      setEditDrawerVisible(true);
    },
  );

  useEffect(() => {
    console.log('param changed, resetPage, submit');
    setPagination({
      ...pagination,
      current: 1,
    });
    ref.current?.submit();
  }, [param]);

  useRequest(async () => {
    const { data } = await services.ChannelController.queryChannels();
    setChannelOptions(
      data.map((row) => ({
        label: row.name,
        value: row.id as number,
      })),
    );
  });

  const { data: countData } = useRequest(
    services.OrderController.queryOrderCounts,
  );

  type TableListItem = ORDER.OrderListItemFlatted;

  const columns: ProColumns<ORDER.OrderListItemFlatted>[] = [
    {
      title: intl.formatMessage({ id: '渠道单号/订单号' }),
      key: 'channelOrderNo',
      dataIndex: 'channelOrderNo',
      search: false,
      width: 200,
      align: 'center',
      fixed: 'left',
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setOrderId(record.orderId);
              openOrderDetailDrawer(record.orderId);
            }}
          >
            {record.channelOrderNo || '无'}
          </Button>
        );
      },
      onCell: (_) => {
        return { rowSpan: _.rowSpan };
      },
    },
    {
      title: intl.formatMessage({ id: '渠道' }),
      ellipsis: true,
      key: 'channelSettingId',
      dataIndex: 'channelSettingId',
      order: 6 - 4,
      width: 100,
      valueEnum: convertOptionToEnums(channelOptions),
      render: (_, record) => {
        const option = channelOptions.find(
          (o) => o.value === record.channelSettingId,
        );
        return option && option.label;
      },
      onCell: (_) => {
        return { rowSpan: _.rowSpan };
      },
    },
    {
      title: intl.formatMessage({ id: '联系人' }),
      key: 'reserveName',
      dataIndex: 'reserveName',
      width: 120,
      search: false,
      onCell: (_) => {
        return { rowSpan: _.rowSpan };
      },
    },
    {
      title: intl.formatMessage({ id: '手机号' }),
      key: 'reservePhone',
      dataIndex: 'reservePhone',
      width: 145,
      search: false,
      onCell: (_) => {
        return { rowSpan: _.rowSpan };
      },
    },
    {
      title: intl.formatMessage({ id: '房型' }),
      dataIndex: 'roomTypeName',
      key: 'roomTypeName',
      valueEnum: convertOptionToEnums(roomTypeOptions),
      order: 6 - 2,
      width: 100,
    },
    {
      title: intl.formatMessage({ id: '房间号' }),
      dataIndex: 'roomCode',
      key: 'roomCode',
      search: false,
      width: 100,
    },
    {
      title: intl.formatMessage({ id: '入住时间' }),
      dataIndex: 'startDate',
      key: 'startDate',
      valueType: 'date',
      hideInSearch: true,
      width: 120,
    },
    {
      title: intl.formatMessage({ id: '日期选择' }),
      dataIndex: 'queryDate',
      key: 'queryDate',
      valueType: 'date',
      order: 6 - 1,
      hideInTable: true,
      renderFormItem: (
        _,
        { type, defaultRender, formItemProps, fieldProps, ...rest },
        form,
      ) => {
        return (
          <div className="compact-date-select" style={{ display: 'flex' }}>
            <Select
              style={{ width: '33%' }}
              defaultValue={param.dateType}
              optionFilterProp="children"
              onChange={(value) => {
                handleDateTypeChange(value);
              }}
            >
              <Option value={1}>
                {intl.formatMessage({ id: '入住时间' })}
              </Option>
              <Option value={2}>
                {intl.formatMessage({ id: '离店时间' })}
              </Option>
              <Option value={3}>
                {intl.formatMessage({ id: '创建时间' })}
              </Option>
            </Select>
            <ProFormDateRangePicker
              {...fieldProps}
              noStyle
              transform={(values) => {
                return {
                  startDate: values ? values[0] : undefined,
                  endDate: values ? values[1] : undefined,
                };
              }}
              name="checkInTimeRanger"
            />
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: '离店时间' }),
      dataIndex: 'endDate',
      key: 'endDate',
      valueType: 'date',
      width: 120,
      search: false,
    },
    {
      title: intl.formatMessage({ id: '间夜' }),
      dataIndex: 'checkInDays',
      key: 'checkInDays',
      width: 80,
      search: false,
    },
    {
      title: intl.formatMessage({ id: '订单状态' }),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      order: 6 - 3,
      valueEnum: convertOptionToEnums(OrderStateOptions),
      renderText: (value) => {
        const option = OrderStateOptions.find(
          (option) => option.value === value,
        );
        return option && option.label;
      },
    },
    {
      title: intl.formatMessage({ id: '房费' }),
      dataIndex: 'totalRoomAmount',
      key: 'totalRoomAmount',
      width: 120,
      search: false,
      renderText(_) {
        return _ ? `A$ ${_}` : '-';
      },
    },
    {
      title: intl.formatMessage({ id: '订单总金额' }),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      search: false,
      renderText(_) {
        return _ ? `A$ ${_}` : '-';
      },
      onCell: (_) => {
        return { rowSpan: _.rowSpan };
      },
    },
    {
      title: intl.formatMessage({ id: '结账状态' }),
      dataIndex: 'payStatus',
      key: 'payStatus',
      width: 105,
      order: 6 - 5,
      valueEnum: convertOptionToEnums(OrderPayOptions),
      renderText(value) {
        const option = OrderPayOptions.find((o) => o.value === value);
        return option && option.label;
      },
      onCell: (_) => {
        return { rowSpan: _.rowSpan };
      },
    },
    {
      title: intl.formatMessage({ id: '创建时间' }),
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
      width: 185,
      search: false,
    },
  ];

  useRequest(async () => {
    const { data } = await services.SettingController.getRoomTypeList({
      current: 1,
      pageSize: 20, // may need extend
    });
    const options =
      data.list?.map(({ id, roomTypeName }) => ({
        value: id as number,
        label: roomTypeName as string,
      })) || [];

    setRoomTypeOptions(options);
  });

  const handleQueryTabChange = (e: QueryType) => {
    setParam({ ...param, queryType: e });
  };
  const handleKeywordChange = (e: string) => {
    setParam({ ...param, keyword: e });
  };
  const handleSearchTypeChange = (e: string) => {
    setParam({ ...param, searchType: e });
  };

  const handleDateTypeChange = (e: DateType) => {
    setParam({ ...param, dateType: e });
  };
  const handleOnExport = async () => {
    const queryParam = generateQueryParam(ref.current?.getFieldsValue());
    const buffer = await services.OrderController.exportList(queryParam);
    bufferDownload(buffer, `${intl.formatMessage({ id: '订单列表' })}.xlsx`);
    message.success(`${intl.formatMessage({ id: '下载成功' })}`);
  };

  const generateQueryParam = (params: Record<string, any>) => {
    const { keyword, searchType, queryType, dateType } = param;
    const {
      roomTypeName: roomTypeId,
      orderStatus: payStatus,
      startDate,
      endDate,
      current: pageNum,
      ...rest
    } = params;

    const keywordParam = searchType && keyword ? { [searchType]: keyword } : {};
    const dateDto =
      dateType && startDate && endDate
        ? {
            dateType,
            startDate,
            endDate,
          }
        : null;
    return {
      roomTypeId,
      payStatus,
      dateDto,
      queryType,
      pageNum,
      ...keywordParam,
      ...rest,
    };
  };

  const [pagination, setPagination] = useState({
    consumed: true, // 分页改变后是否已经触发过接口查询
    pageSize: 10,
    total: 0,
    current: 1,
  });

  return (
    <div className="all-order-page">
      <div className="custom-page-header">
        {!isNotArranged ? (
          <Radio.Group
            value={param.queryType}
            onChange={(e) => handleQueryTabChange(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value={QueryType.ALL}>
              {intl.formatMessage({ id: '全部' })}
            </Radio.Button>
            <Radio.Button value={QueryType.TODAY_ARRIVE}>
              {intl.formatMessage({ id: '今日预抵' })}
            </Radio.Button>
            <Radio.Button value={QueryType.TODAY_LEAVE}>
              {intl.formatMessage({ id: '今日预离' })}
            </Radio.Button>
            <Radio.Button value={QueryType.TODAY_CREAYED}>
              {intl.formatMessage({ id: '今日新办' })}
            </Radio.Button>

            <Radio.Button
              className={classNames({
                dotted: countData && countData.unlinedCount > 0,
              })}
              value={QueryType.NOT_ARRANGED}
            >
              {intl.formatMessage({ id: '未排房' })}
            </Radio.Button>
          </Radio.Group>
        ) : null}
        <Space size="large" className="quick-action-bar">
          <Select
            placeholder={intl.formatMessage({ id: '搜索类型' })}
            optionFilterProp="children"
            value={param.searchType}
            onChange={(value) => {
              handleSearchTypeChange(value);
            }}
          >
            <Option value="channelOrderNo">
              {intl.formatMessage({ id: '搜索渠道单号/订单号' })}
            </Option>
            <Option value="reserveName">
              {intl.formatMessage({ id: '搜索姓名' })}
            </Option>
            <Option value="reservePhone">
              {intl.formatMessage({ id: '搜索手机号' })}
            </Option>
            <Option value="roomCode">
              {intl.formatMessage({ id: '房间号' })}
            </Option>
          </Select>

          <Input.Search
            disabled={!param.searchType}
            style={{ width: '340px' }}
            value={param.keyword}
            placeholder={intl.formatMessage({
              id: '订单&渠道号/姓名/手机号/房间号',
            })}
            // onChange={e => handleKeywordChange(e.target.value)}
            onSearch={(e) => {
              console.log('onSearch', e);
              handleKeywordChange(e);
            }}
            enterButton
            allowClear
          />

          {/* <Button
            type="primary"
            onClick={() => {
              setEditDrawerVisible(true);
            }}
          >
            模拟预定
          </Button> */}
          <Button type="primary" onClick={handleOnExport}>
            {intl.formatMessage({ id: '导出报表' })}
          </Button>
        </Space>
      </div>

      <ProTable<TableListItem>
        size="large"
        formRef={ref}
        scroll={{ x: 'scroll' }}
        bordered
        row-key="orderId"
        onReset={() => {
          const { keyword, searchType, ...rest } = param;
          setParam({
            ...rest,
            searchType: 'channelOrderNo',
            keyword: '',
          });
        }}
        search={{
          defaultCollapsed: false,
        }}
        columns={columns}
        request={async (params) => {
          let newPagination = pagination.consumed
            ? {
                // 查询条件变
                ...pagination,
                current: 1,
              }
            : {
                // 分页条件变
                ...pagination,
                consumed: true,
              };

          const queryParam = generateQueryParam(
            Object.assign({}, params, {
              pageSize: newPagination.pageSize,
              current: newPagination.current,
            }),
          );
          const { data } = await services.OrderController.queryList(queryParam);
          const { list = [], total } = data || {};
          const flattedList = [];
          let index = 0;
          for (let i = 0; i < list.length; i++) {
            const { roomDtoList, totalAmount, ...rest } = list[i];
            if (roomDtoList.length === 0) {
              flattedList.push({
                ...rest,
                rowSpan: 1,
                key: `${index++}`,
              });
            } else {
              for (let j = 0; j < roomDtoList.length; j++) {
                const room = roomDtoList[j];
                flattedList.push({
                  ...rest,
                  ...room,
                  rowSpan: j === 0 ? roomDtoList.length : 0,
                  totalAmount,
                  key: `${index++}`,
                });
              }
            }
          }
          setPagination({
            ...newPagination,
            total: total || 0,
          });

          return {
            total,
            data: flattedList,
          };
        }}
        options={false}
        pagination={false}
      />

      {/* 
        订单数据请求10条，访客信息可能超过10条，在table的源码中，发现数据超过pageSize，会做slice处理，导致无法正常展示数据
        https://github.com/ant-design/ant-design/blob/master/components/table/Table.tsx pageData部分 

        因此采取自定义pagination的做法，更新时候通过触发ProTable的submit来请求数据
      */}
      <Pagination
        current={pagination.current}
        total={pagination.total}
        showQuickJumper
        showSizeChanger
        onChange={(page, pageSize) => {
          setPagination({
            total: pagination.total,
            consumed: false,
            current: page,
            pageSize,
          });
          ref.current?.submit();
        }}
        // showTotal={(total, range) => {
        //   return (
        //     <div>
        //       第 {range[0]}-{range[1]} 条/总共 {total} 条
        //     </div>
        //   );
        // }}
      />

      {OrderDetailDrawer}

      <OrderFormDrawer
        visible={editDrawerVisible}
        onVisibleChange={(value) => setEditDrawerVisible(value)}
        id={orderId}
        onSubmited={() => {
          ref.current?.submit();
          setEditDrawerVisible(false);
          setOrderId(undefined);
        }}
      />
    </div>
  );
};

export default OrderContainer;
