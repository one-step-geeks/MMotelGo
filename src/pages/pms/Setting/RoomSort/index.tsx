import React from 'react';
import { useIntl } from 'umi';
import { Alert, Tabs } from 'antd';
import SortableRooms from './components/SortableRooms';

const { TabPane } = Tabs;

const RoomSortPage: React.FC = () => {
  const intl = useIntl();

  return (
    <div>
      <Alert
        closable
        message={intl.formatMessage({ id: 'SORT_TIP_NOTE' })}
        type="info"
      />
      <Tabs defaultActiveKey="1">
        <TabPane tab={intl.formatMessage({ id: '房型排序' })} key="1">
          <SortableRooms type={1} />
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: '房间排序' })} key="2">
          <SortableRooms type={2} />
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: '分组排序' })} key="3">
          <SortableRooms type={3} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default RoomSortPage;
