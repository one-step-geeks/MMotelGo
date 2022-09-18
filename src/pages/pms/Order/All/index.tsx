import React, { useState, useEffect, useRef } from 'react';
import { bufferDownload } from '@/utils';
import {
  ProTable,
  ProFormDateRangePicker,
  ProFormInstance,
  FieldLabel,
} from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import moment from 'moment';
import { useRequest, useLocation } from 'umi';
import services from '@/services';
import { message, Radio, Button, Input, Space, Select } from 'antd';
import {
  OrderState,
  OperateData,
  OrderStateOptions,
  OrderPayOptions,
} from '@/services/OrderController';
import OrderDetailDrawer from '../components/OrderDetailDrawer';
import OrderFormDrawer from '../components/OrderFormDrawer';
import OrderOperateDrawer from '../components/OrderOperateDrawer';

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
  keyword?: string;
  searchType: string;
  dateType: DateType;
}
enum DateType {
  checkInDate = 1,
  checkOutDate,
  createDate,
}
const OrderContainer: React.FC = (props) => {
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
  const [detailOpen, setDetailOpen] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [operateDrawerVisible, setOperateDrawerVisible] = useState(false);
  const [operateData, setOperateData] = useState<OperateData>();
  const [orderStatus, setOrderStatus] = useState<OrderState>();

  useEffect(() => {
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

  type TableListItem = ORDER.OrderListItemFlatted;

  const columns: ProColumns<ORDER.OrderListItemFlatted>[] = [
    {
      title: '渠道单号/订单号',
      key: 'channelOrderNo',
      dataIndex: 'channelOrderNo',
      search: false,
      width: 200,
      align: 'center',
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              console.log('record.orderId');
              setOrderId(record.orderId);
              setDetailOpen(true);
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
      title: '渠道',
      ellipsis: true,
      key: 'channelType',
      dataIndex: 'channelType',
      order: 6 - 4,
      valueEnum: convertOptionToEnums(channelOptions),
      render: (_, record) => {
        const option = channelOptions.find(
          (o) => o.value === record.channelType,
        );
        return option && option.label;
      },
      onCell: (_) => {
        return { rowSpan: _.rowSpan };
      },
    },
    {
      title: '联系人',
      key: 'reserveName',
      dataIndex: 'reserveName',
      search: false,
      onCell: (_) => {
        return { rowSpan: _.rowSpan };
      },
    },
    {
      title: '手机号',
      key: 'reservePhone',
      dataIndex: 'reservePhone',
      width: 145,
      search: false,
      onCell: (_) => {
        return { rowSpan: _.rowSpan };
      },
    },
    {
      title: '房型',
      dataIndex: 'roomTypeName',
      key: 'roomTypeName',
      valueEnum: convertOptionToEnums(roomTypeOptions),
      order: 6 - 2,
    },
    {
      title: '房间号',
      dataIndex: 'roomCode',
      key: 'roomCode',
      search: false,
    },
    {
      title: '入住时间',
      dataIndex: 'startDate',
      key: 'startDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '日期选择',
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
              defaultValue={param.dateType}
              optionFilterProp="children"
              onChange={(value) => {
                handleDateTypeChange(value);
              }}
            >
              <Option value={1}>入住时间</Option>
              <Option value={2}>离店时间</Option>
              <Option value={3}>创建时间</Option>
            </Select>
            <ProFormDateRangePicker
              {...fieldProps}
              transform={(values) => {
                return {
                  startDate: values ? values[0] : undefined,
                  endDate: values ? values[1] : undefined,
                };
              }}
              name="checkInTimeRanger"
              placeholder={['开始时间', '开始时间']}
            />
          </div>
        );
      },
    },
    {
      title: '离店时间',
      dataIndex: 'endDate',
      key: 'endDate',
      valueType: 'date',
      search: false,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
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
      title: '房费',
      dataIndex: 'roomPrice',
      key: 'roomPrice',
      search: false,
      renderText(_) {
        return `A$ ${_}`;
      },
    },
    {
      title: '订单总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      search: false,
      renderText(_) {
        return `A$ ${_}`;
      },
      onCell: (_) => {
        return { rowSpan: _.rowSpan };
      },
    },
    {
      title: '结账状态',
      dataIndex: 'payStatus',
      key: 'payStatus',
      order: 6 - 5,
      valueEnum: convertOptionToEnums(OrderPayOptions),
      renderText(_, record) {
        const option = OrderPayOptions.find((o) => o.value === record.status);
        return option && option.label;
      },
      onCell: (_) => {
        return { rowSpan: _.rowSpan };
      },
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
    console.log('export via', param);
    const queryParam = generateQueryParam(ref.current?.getFieldsValue());
    const buffer = await services.OrderController.exportList(queryParam);
    bufferDownload(buffer, `订单列表.xlsx`);
    message.success('下载成功');
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
  return (
    <div className="all-order-page">
      <div className="custom-page-header">
        {!isNotArranged ? (
          <Radio.Group
            value={param.queryType}
            onChange={(e) => handleQueryTabChange(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value={QueryType.ALL}>全部</Radio.Button>
            <Radio.Button value={QueryType.TODAY_ARRIVE}>今日预抵</Radio.Button>
            <Radio.Button value={QueryType.TODAY_LEAVE}>今日预离</Radio.Button>
            <Radio.Button value={QueryType.TODAY_CREAYED}>
              今日新办
            </Radio.Button>
          </Radio.Group>
        ) : null}
        <Space size="large" className="quick-action-bar">
          {/* onSearch={onSearch} */}

          {/* (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase()) */}
          {/* e => handleKeywordChange(e.target.value) */}
          {/* 订单号/渠道单号/姓名/手机号/房间号 */}
          <Select
            placeholder="搜索类型"
            // showSearch
            optionFilterProp="children"
            // onSearch={value => {
            //   handleKeywordChange(value)
            // }}
            onChange={(value) => {
              handleSearchTypeChange(value);
              // return false;
              // console.log('onChange e.target.value', e, el);
            }}
          >
            <Option value="channelOrderNo">搜索订单号/渠道单号</Option>
            <Option value="reserveName">搜索姓名</Option>
            <Option value="reservePhone">搜索手机号</Option>
            <Option value="roomCode">房间号</Option>
          </Select>

          <Input.Search
            disabled={!param.searchType}
            style={{ width: '340px' }}
            placeholder="订单&渠道号/姓名/手机号/房间号"
            // onChange={e => handleKeywordChange(e.target.value)}
            onSearch={(e) => {
              console.log('onSearch', e);
              handleKeywordChange(e);
            }}
            enterButton
            allowClear
          />

          <Button
            type="primary"
            onClick={() => {
              setEditDrawerVisible(true);
              setOrderStatus(OrderState.IS_ORDERED);
            }}
          >
            模拟预定
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setEditDrawerVisible(true);
              setOrderStatus(OrderState.IS_CHECKED);
            }}
          >
            模拟入住
          </Button>
          <Button type="primary" onClick={handleOnExport}>
            导出报表
          </Button>
        </Space>
      </div>

      <ProTable<TableListItem>
        size="large"
        formRef={ref}
        scroll={{ x: 'scroll' }}
        bordered
        row-key="orderId"
        search={{
          defaultCollapsed: false,
        }}
        columns={columns}
        request={async (params) => {
          const queryParam = generateQueryParam(params);

          const { data } = await services.OrderController.queryList(queryParam);
          const { list = [], total } = data || {};
          const flattedList = [];
          let index = 0;
          for (let i = 0; i < list.length; i++) {
            const { roomDtoList, ...rest } = list[i];
            for (let j = 0; j < roomDtoList.length; j++) {
              const room = roomDtoList[j];
              // console.log('roomDtoList.length', roomDtoList.length);
              flattedList.push({
                rowSpan: j === 0 ? roomDtoList.length : 0,
                ...rest,
                ...room,
                key: `${index++}`,
              });
            }
          }
          return {
            total,
            data: flattedList.slice(0, 10) || [],
          };
        }}
        options={false}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
      />

      <OrderDetailDrawer
        id={orderId!}
        visible={detailOpen}
        onVisibleChange={(value) => {
          setOrderId(undefined);
          setDetailOpen(value);
        }}
        gotoEdit={() => {
          setEditDrawerVisible(true);
        }}
        gotoOperate={(data: OperateData) => {
          setOperateData(data);
          setOperateDrawerVisible(true);
        }}
      />
      <OrderOperateDrawer
        visible={operateDrawerVisible}
        onVisibleChange={(value) => setOperateDrawerVisible(value)}
        // onSuccess={() => {
        //   setOperateDrawerVisible(false);
        // }}
        operateData={operateData}
      />

      {orderId ? (
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
      ) : (
        <OrderFormDrawer
          visible={editDrawerVisible}
          onVisibleChange={(value) => setEditDrawerVisible(value)}
          rooms={[
            {
              roomId: 452,
              startDate: moment(),
              checkInDays: 1,
              roomTypeName: '大套房',
              roomCode: '206',
              roomPrice: 2,
              totalAmount: 2 * 1,
            },
          ]}
          status={orderStatus}
          onSubmited={() => {
            ref.current?.submit();
            setEditDrawerVisible(false);
            setOrderId(undefined);
          }}
        />
      )}
    </div>
  );
};

export default OrderContainer;
