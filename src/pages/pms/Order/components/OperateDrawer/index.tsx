import { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useIntl } from 'umi';
import services from '@/services';
import { DrawerForm, ProFormTextArea } from '@ant-design/pro-components';
import { message, Space, Form, Checkbox, Button } from 'antd';
import { OperateData, OperationTypeText } from '@/services/OrderController';
import './style.less';

export interface FormOrder {}

export function useOperateDrawer(onSuccess: () => void) {
  const intl = useIntl();
  const [operateData, setOperateData] = useState<OperateData>();
  const [form] = Form.useForm<FormOrder>();
  const [visible, setVisible] = useState(false);
  const [selectedRoomIndexs, setSelectedRoomIndexs] = useState<Array<number>>(
    [],
  );
  const [selectedRoomFeeTotal, setSelectedRoomFeeTotal] = useState<number>(0);

  const title =
    operateData?.operationType === undefined
      ? intl.formatMessage({ id: '订单操作' })
      : intl.formatMessage({
          id: OperationTypeText[operateData?.operationType],
        });

  const handleRoomChecked = (index: number, value: boolean) => {
    const checkedIndexs = value
      ? [index, ...selectedRoomIndexs]
      : selectedRoomIndexs.filter((i) => i !== index);
    setSelectedRoomIndexs(checkedIndexs);
    setSelectedRoomFeeTotal(
      checkedIndexs.reduce((acc, cur, index) => {
        return acc + operateData?.orderRoomList?.[index].totalAmount!;
      }, 0),
    );
  };

  const OperateDrawer = (
    <DrawerForm
      title={title}
      form={form}
      layout="horizontal"
      grid
      autoFocusFirstInput
      visible={visible}
      drawerProps={{
        width: 640,
        closeIcon: (
          <>
            <Space>
              <ArrowLeftOutlined />
              {intl.formatMessage({ id: '返回' })}
            </Space>
          </>
        ),
        destroyOnClose: true,
        maskClosable: false,
        onClose: () => {
          form.resetFields();
          setVisible(false);
        },
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        try {
          const rooms = operateData?.orderRoomList.filter((r, i) => {
            return selectedRoomIndexs.includes(i);
          });

          await services.OrderController.operateOrder({
            orderId: operateData?.order.id,
            roomReq: rooms?.map((r) => ({ id: r.id })),
            operationType: operateData?.operationType,
            remark: values.remark,
          });
          message.success(intl.formatMessage({ id: `${title}成功` }));
          setVisible(false);
          form.resetFields();
          onSuccess();
          return true;
        } catch (err) {}
      }}
      submitter={{
        render: (props) => {
          return [
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                if (selectedRoomIndexs.length === 0) {
                  return message.error(
                    intl.formatMessage({ id: '请至少选择1条记录' }),
                  );
                }
                props.submit();
              }}
            >
              {title}
            </Button>,
          ];
        },
      }}
    >
      <div className="overview-header">
        <Checkbox
          onClick={() => {
            if (
              selectedRoomIndexs.length === operateData?.orderRoomList.length
            ) {
              setSelectedRoomIndexs([]);
            } else if (operateData?.orderRoomList) {
              setSelectedRoomIndexs(
                operateData?.orderRoomList.map((r, i) => i),
              );
            }
          }}
          checked={
            selectedRoomIndexs.length === operateData?.orderRoomList.length
          }
        >
          {intl.formatMessage({ id: '全选' })}
        </Checkbox>
        <span>
          {intl.formatMessage(
            { id: 'compound.orderRoomOverview' },
            {
              selectedCount: selectedRoomIndexs.length,
              totalCount: operateData?.orderRoomList?.length,
            },
          )}
        </span>
      </div>
      <div className="room-list">
        {operateData?.orderRoomList.map((room, index) => {
          return (
            <div className="room-card">
              {/* <ProFormCheckbox noStyle proFormFieldKey={}={{noS}} name={['roomKeys', index]} /> */}
              <Checkbox
                checked={selectedRoomIndexs.includes(index)}
                onChange={(e) => {
                  handleRoomChecked(index, e.target.checked);
                }}
              >
                {room.roomTypeName}/{room.roomCode}
              </Checkbox>
              <div>
                {moment(room.startDate).format('YYYY-MM-DD')}
                {intl.formatMessage({ id: '至' })}
                {moment(room.endDate).format('YYYY-MM-DD')}，
                {intl.formatMessage({ id: '共' })}
                {room.checkInDays}
                {intl.formatMessage({ id: '晚' })}
                <br />
                {intl.formatMessage({ id: '房费' })}：A$ {room.totalAmount}
              </div>
            </div>
          );
        })}
      </div>
      <div className="fee-overview">
        <div>
          {intl.formatMessage({ id: '订单总额' })}：A$ {selectedRoomFeeTotal}
        </div>
        <div>
          <span>
            {intl.formatMessage({ id: '已付金额' })}：A${' '}
            {operateData?.order?.paidAmount || 0}{' '}
          </span>
          <span className="emphisis">
            {intl.formatMessage({ id: '还需收款' })}：A${' '}
            {Math.max(
              0,
              selectedRoomFeeTotal - (operateData?.order?.paidAmount || 0),
            )}
          </span>
        </div>
      </div>

      <ProFormTextArea
        name="remark"
        // placeholder={`请填写${title}备注`}
        fieldProps={{}}
      />
    </DrawerForm>
  );

  const openOperateDrawer = (operateData: OperateData) => {
    setOperateData(operateData);
    setVisible(true);
    setSelectedRoomIndexs(operateData?.orderRoomList.map((r, i) => i));
    setSelectedRoomFeeTotal(operateData.order.totalAmount);
  };
  return { OperateDrawer, openOperateDrawer };
}
