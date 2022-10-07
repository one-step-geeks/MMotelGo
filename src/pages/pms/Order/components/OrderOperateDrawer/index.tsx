import { ArrowLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import services from '@/services';
import {
  DrawerForm,
  ProFormTextArea,
  ProFormCheckbox,
} from '@ant-design/pro-components';
import { message, Input, Space, Form, Checkbox, Button } from 'antd';
import { OperateData, OperationTypeText } from '@/services/OrderController';
import { useEffect, useState } from 'react';

interface Props {
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  operateData?: OperateData;
}

export interface FormOrder {}

export default (props: Props) => {
  const [form] = Form.useForm<FormOrder>();
  const [selectedRoomIndexs, setSelectedRoomIndexs] = useState<Array<number>>(
    [],
  );
  const [selectedRoomFees, setSelectedRoomFees] = useState({
    feeTotal: 0,
    feeNotPaied: 0,
  });
  const title =
    props.operateData?.operationType === undefined
      ? '订单操作'
      : OperationTypeText[props.operateData?.operationType];

  useEffect(() => {
    if (props.operateData) {
      console.log('setSelectedRoomIndexs');
      setSelectedRoomIndexs(props.operateData?.orderRoomList.map((r, i) => i));
    }
  }, [props.operateData]);

  const handleRoomChecked = (index: number, value: boolean) => {
    if (value) {
      setSelectedRoomIndexs([index, ...selectedRoomIndexs]);
    } else {
      setSelectedRoomIndexs(selectedRoomIndexs.filter((i) => i !== index));
    }
    let feeTotal = 0;
    let feePaied = 0;
    selectedRoomIndexs.forEach((i) => {
      const orderRoom = props.operateData?.orderRoomList[i];
      if (orderRoom) {
        const { totalAmount } = orderRoom;
        feeTotal += totalAmount!;
        feePaied += 0;
      }
    });
    setSelectedRoomFees({
      feeTotal,
      feeNotPaied: feeTotal - feePaied,
    });
  };

  return (
    <DrawerForm
      title={title}
      form={form}
      layout="horizontal"
      grid
      autoFocusFirstInput
      visible={props.visible}
      drawerProps={{
        width: 640,
        closeIcon: (
          <>
            <Space>
              <ArrowLeftOutlined />
              返回
            </Space>
          </>
        ),
        destroyOnClose: true,
        maskClosable: false,
        onClose: () => {
          form.resetFields();
          props.onVisibleChange(false);
        },
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        try {
          console.log('values', values);
          const rooms = props.operateData?.orderRoomList.filter((r, i) => {
            return selectedRoomIndexs.includes(i);
          });

          await services.OrderController.operateOrder({
            orderId: props.operateData?.order.id,
            roomReq: rooms?.map((r) => ({ id: r.id })),
            operationType: props.operateData?.operationType,
            remark: values.remark,
          });
          message.success(`${title}成功`);
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
                  return message.error('请至少选择1条记录');
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
              selectedRoomIndexs.length ===
              props.operateData?.orderRoomList.length
            ) {
              setSelectedRoomIndexs([]);
            } else if (props.operateData?.orderRoomList) {
              setSelectedRoomIndexs(
                props.operateData?.orderRoomList.map((r, i) => i),
              );
            }
          }}
          checked={
            selectedRoomIndexs.length ===
            props.operateData?.orderRoomList.length
          }
        >
          全选
        </Checkbox>
        <span>
          已选{selectedRoomIndexs.length}间，共
          {props.operateData?.orderRoomList?.length}间
        </span>
      </div>
      <div className="room-list">
        {props.operateData?.orderRoomList.map((room, index) => {
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
                {moment(room.startDate).format('YYYY-MM-DD')}至
                {moment(room.startDate)
                  .add(room.checkInDays)
                  .format('YYYY-MM-DD')}
                ，共{room.checkInDays}晚
                <br />
                房费：A$ {room.totalAmount}
              </div>
            </div>
          );
        })}
      </div>
      <div className="fee-overview">
        <div>订单总额：A$ {selectedRoomFees.feeTotal}</div>
        <div>
          <span>已付金额：A$ 0.00 </span>
          <span className="emphisis">
            还需收款：A${selectedRoomFees.feeNotPaied}
          </span>
        </div>
      </div>

      <ProFormTextArea
        name="remark"
        placeholder={`请填写${title}备注`}
        fieldProps={{}}
      />
    </DrawerForm>
  );
};
