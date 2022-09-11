import { Button, Col, Card, DatePicker, Drawer, Form, Input, Row } from 'antd';
import React, { useState } from 'react';
import { selectService } from '../service';
import { useModel } from 'umi';
import OrderRoomItem from './OrderRoomItem';

interface Props {
  visible: boolean;
  onClose?: () => void;
}

const AddOrderDrawer: React.FC<Props> = (props) => {
  const { visible, onClose } = props;
  const [form] = Form.useForm();
  const { selectedRooms, setSelectedRooms } = useModel('state');

  return (
    <Drawer
      title="新建订单"
      onClose={() => {
        setSelectedRooms([]);
        selectService.sendCancelInfo();
        onClose?.();
      }}
      width={532}
      visible={visible}
      maskClosable={false}
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        <Card title="基本信息" bordered={false} size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '必填项' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mobile"
                label="手机"
                rules={[{ required: true, message: '必填项' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="房间信息" bordered={false} size="small">
          {selectedRooms?.map((item) => {
            return <OrderRoomItem data={item} />;
          })}
        </Card>
      </Form>
    </Drawer>
  );
};

export default AddOrderDrawer;
