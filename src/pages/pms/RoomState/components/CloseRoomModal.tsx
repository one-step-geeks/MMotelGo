import { Button, Form, Radio, Modal, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProFormTextArea, ProFormRadio } from '@ant-design/pro-components';
import { useModel } from 'umi';

const FormItem = Form.Item;

interface Props {
  onClose?: () => void;
  visible: boolean;
}

const layoutConfig = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const CloseRoomModal: React.FC<Props> = (props) => {
  const { visible, onClose } = props;
  const { selectedRooms } = useModel('state');
  const [form] = Form.useForm();

  return (
    <Modal
      width={600}
      visible={visible}
      maskClosable={false}
      destroyOnClose
      title="批量关房"
      onOk={async () => {
        const data = await form.validateFields();
        console.log(data, selectedRooms);
      }}
      onCancel={onClose}
    >
      <Form {...layoutConfig} form={form}>
        <FormItem
          label="关房类型"
          name="closeType"
          initialValue={1}
          rules={[{ required: true, message: '必填项' }]}
        >
          <Radio.Group>
            <Radio value={1}>停用房</Radio>
            <Radio value={2}>维修房</Radio>
            <Radio value={3}>保留房</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="备注" name="remark">
          <Input.TextArea rows={4} maxLength={200} showCount />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CloseRoomModal;
