import { useRequest } from 'umi';
import services from '@/services';
import { Card, Button, Skeleton, Empty } from 'antd';
import { Timeline } from 'antd';
import moment from 'moment';

interface Props {
  orderId: number;
}

enum OperationTypeKeys {
  ORDER_CREATION = 1,
  CHECK_IN,
  CHECK_OUT,
  CREATE_ROOMS,
  INCREASE_GUESTS,
  CHANGE_ROOM,
  CHANGE_OF_RESIDENTS,
  STATUS_ROLLBACK,
  NEW_RECEIPTS,
  NEW_REFUNDS,
  MODIFY_COLLECTION_ITEM,
  DELETE_COLLECTION,
  ORDER_REMINDER,
}

const OperationTypeTexts = {
  [OperationTypeKeys.ORDER_CREATION]: '订单创建',
  [OperationTypeKeys.CHECK_IN]: '入住',
  [OperationTypeKeys.CHECK_OUT]: '退房',
  [OperationTypeKeys.CREATE_ROOMS]: '增加',
  [OperationTypeKeys.INCREASE_GUESTS]: '增加住客',
  [OperationTypeKeys.CHANGE_ROOM]: '变更客房',
  [OperationTypeKeys.CHANGE_OF_RESIDENTS]: '变更住客',
  [OperationTypeKeys.STATUS_ROLLBACK]: '状态回滚',
  [OperationTypeKeys.NEW_RECEIPTS]: '新收款项',
  [OperationTypeKeys.NEW_REFUNDS]: '新退款项',
  [OperationTypeKeys.MODIFY_COLLECTION_ITEM]: '修改收款项',
  [OperationTypeKeys.DELETE_COLLECTION]: '删除收款项',
  [OperationTypeKeys.ORDER_REMINDER]: '订单提醒',
};

const OperationLog: React.FC<Props> = (props) => {
  const { data } = useRequest(() => {
    return services.OrderController.queryOperationLog(props.orderId);
  });

  return data?.length ? (
    <Timeline>
      {data.map((record) => {
        return (
          <Timeline.Item>
            <div style={{ fontSize: '13px', color: '#666' }}>
              {moment(record.createTime).format('YYYY-MM-DD hh:mm:ss')}
              &nbsp;操作人:{record.creator}&nbsp;
              {OperationTypeTexts[record.operationType as OperationTypeKeys]}
            </div>
            <div style={{ fontSize: '14px', paddingTop: '6px' }}>
              {record.remark}
            </div>
          </Timeline.Item>
        );
      })}
    </Timeline>
  ) : (
    <Empty></Empty>
  );
};

export default OperationLog;
