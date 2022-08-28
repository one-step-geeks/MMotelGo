import React, { useEffect, useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { useHistory } from 'umi';
import { Layout, Menu, Radio, Button, Input, Space } from 'antd';
// import {
//   UserOutlined,
//   LaptopOutlined,
//   NotificationOutlined,
//   MoneyCollectOutlined,
// } from '@ant-design/icons';
import { QueryFilter } from '@ant-design/pro-form';
import {
  ProForm,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
} from '@ant-design/pro-components';
import { message } from 'antd';

import './style.less';

// const { SubMenu } = Menu;
// const { Content, Sider } = Layout;

enum QueryType {
  ALL = 'all',
  TODAY_ARRIVE = 'today-arrive',
  TODAY_LEAVE = 'today-leave',
  TODAY_CREAYED = 'today-created',
}
interface QueryParam {
  queryType?: QueryType;
  keyword?: string;
  channel?: number; //  "chapter"
  checkInStatus?: number; //  "chapter"
  endTime?: string; //  "2022-10-02"
  startTime?: string; //  "2022-09-01"
  payStatus?: number; //  "chapter"
  payType?: number; //  "chapter"
  rentType?: number; //  "chapter"
  roomType?: number; //  "chapter"
}

const OrdeerContainer: React.FC = (props) => {
  const [param, setParam] = useState<QueryParam>({
    queryType: QueryType.ALL,
  });
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    search();
  }, [param]);

  const generateParam = () => {
    return Object.assign(param, { keyword });
  };
  const search = () => {
    console.log('search via:', generateParam());
  };

  const handleQueryTabChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setParam({ ...param, queryType: value });
  };

  const handleOnSearch = () => {
    search();
  };
  const handleOnExport = () => {
    console.log('export via:', generateParam());
  };

  return (
    <div className="all-order-page">
      <Radio.Group
        value={param.queryType}
        onChange={handleQueryTabChange}
        buttonStyle="solid"
      >
        <Radio.Button value={QueryType.ALL}>全部</Radio.Button>
        <Radio.Button value={QueryType.TODAY_ARRIVE}>今日预抵</Radio.Button>
        <Radio.Button value={QueryType.TODAY_LEAVE}>今日预离</Radio.Button>
        <Radio.Button value={QueryType.TODAY_CREAYED}>今日新办</Radio.Button>
      </Radio.Group>

      <Space size="large" className="quick-action-bar">
        <Input.Search
          style={{ width: '340px' }}
          value={keyword}
          placeholder="订单&渠道号/姓名/手机号/房间号"
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleOnSearch}
          onSearch={handleOnSearch}
          enterButton
          allowClear
        />
        <Button type="primary" onClick={handleOnExport}>
          导出报表
        </Button>
      </Space>

      <ProForm
        // submitter={ { render: false}}
        onFinish={async (values) => {
          setParam({ ...param, ...values });
          search();
        }}
        layout="inline"
      >
        <ProFormDateRangePicker
          transform={(values) => {
            return {
              startTime: values ? values[0] : undefined,
              endTime: values ? values[1] : undefined,
            };
          }}
          name="checkInTimeRanger"
          placeholder={['入住开始时间', '入住开始时间']}
        />

        <ProFormSelect
          style={{ width: '200x' }}
          options={[
            {
              value: 1,
              label: '类型',
            },
          ]}
          name="roomType"
          placeholder="全部房型"
        />

        <ProFormSelect
          options={[
            {
              value: 1,
              label: '类型a',
            },
          ]}
          name="checkInStatus"
          placeholder="入住状态"
        />

        <ProFormSelect
          options={[
            {
              value: 1,
              label: '类型',
            },
          ]}
          name="channel"
          placeholder="全部渠道"
        />

        <ProFormSelect
          options={[
            {
              value: 1,
              label: '类型',
            },
          ]}
          name="payType"
          placeholder="付款类型"
        />

        <ProFormSelect
          options={[
            {
              value: 1,
              label: '类型',
            },
          ]}
          name="rentType"
          placeholder="全部入住类型"
        />

        <ProFormSelect
          options={[
            {
              value: 1,
              label: '类型',
            },
          ]}
          name="payStatus"
          placeholder="全部结账状态"
        />
      </ProForm>
    </div>
  );
};

export default OrdeerContainer;
