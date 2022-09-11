import {
  Button,
  Col,
  Card,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from 'antd';
import React, { useState } from 'react';
import { selectService } from '../service';
import { useModel } from 'umi';
const { Option } = Select;

interface Props {
  visible: boolean;
  onClose?: () => void;
}

const AddOrderDrawer: React.FC<Props> = (props) => {
  const { visible, onClose } = props;
  const [form] = Form.useForm();
  const { selectedRooms, setSelectedRooms } = useModel('state');

  console.log(selectedRooms);

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
    >
      <Form form={form}>
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
          todo
        </Card>
      </Form>
    </Drawer>
  );
};

export default AddOrderDrawer;
