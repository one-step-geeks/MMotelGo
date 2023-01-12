import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import services from '@/services';
import moment from 'moment';
import { DrawerForm, ProFormText } from '@ant-design/pro-components';
import { message, Input, Space, Form, Button } from 'antd';
import { useEffect, useState } from 'react';
import './style.less';

interface FormOrder {}

export function useOccupantDrawer(onSuccess: () => void) {
  const [form] = Form.useForm<FormOrder>();
  const [visible, setVisible] = useState(false);
  const [room, setRoom] = useState<ORDER.OrderRoom | undefined>();
  const [orderId, setOrderId] = useState<number | undefined>();

  useEffect(() => {
    if (visible) {
      services.OrderController.queryOccupants({
        orderId,
        orderRoomId: room?.id,
      }).then((res) => {
        const { data } = res;
        form.setFieldsValue({
          personList: data?.list || [],
        });
      });
    }
  }, [orderId, room?.roomId, visible]);

  const OccupantDrawer = (
    <DrawerForm
      title={'新增入住人'}
      form={form}
      className="order-person-drawer"
      layout="horizontal"
      grid
      autoFocusFirstInput
      visible={visible}
      labelCol={{
        md: 4,
      }}
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
          setVisible(false);
        },
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        try {
          await services.OrderController.updateOccupants({
            orderId,
            orderRoomId: room?.id,
            ...values,
          });
          message.success('添加成功');
          setVisible(false);
          form.resetFields();
          onSuccess();
          return true;
        } catch (err) {}
      }}
    >
      <div className="room-sticky">
        <span>{moment(room?.startDate).format('MM-DD')}入住</span>
        <span>
          {room?.roomTypeName}/{room?.roomCode}
        </span>
        <span>{room?.checkInDays}晚</span>
        <span>A$ {room?.totalAmount}</span>
      </div>

      <Form.List name={'personList'}>
        {(fields, { add, remove: remove }, { errors }) => (
          <>
            {fields.map((field, index) => {
              return (
                <Form.Item className="person-row" key={field.key}>
                  <Input.Group compact>
                    <ProFormText
                      rules={[
                        { required: true, message: '入住人姓名不能为空' },
                      ]}
                      name={[field.name, 'nickName']}
                      placeholder="入住人姓名"
                    ></ProFormText>
                    <ProFormText
                      name={[field.name, 'phoneNo']}
                      placeholder="联系方式"
                    ></ProFormText>
                    <DeleteOutlined
                      style={{
                        padding: '10px 5px',
                      }}
                      onClick={() => {
                        remove(field.name);
                      }}
                    ></DeleteOutlined>
                  </Input.Group>
                </Form.Item>
              );
            })}

            <Form.Item className="add-row">
              <Button
                type="link"
                onClick={() => {
                  add();
                }}
                icon={<PlusOutlined />}
              >
                添加入住人
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </DrawerForm>
  );

  const openOccupantDrawer = (orderId: number, room: ORDER.OrderRoom) => {
    setOrderId(orderId);
    setRoom(room);
    setVisible(true);
  };

  return { OccupantDrawer, openOccupantDrawer };
}
