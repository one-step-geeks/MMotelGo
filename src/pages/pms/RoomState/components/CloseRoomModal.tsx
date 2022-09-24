import { Form, Radio, Modal, Input } from 'antd';
import { useModel } from 'umi';
import services from '@/services';
import { selectService } from './service';

const FormItem = Form.Item;

interface Props {
  onClose?: () => void;
  onSubmit?: () => void;
  visible: boolean;
  stateList?: ROOM_STATE.CloseRoomInfo[];
}

const layoutConfig = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const CloseRoomModal: React.FC<Props> = (props) => {
  const { visible, onClose, onSubmit, stateList } = props;
  const [form] = Form.useForm();

  return (
    <Modal
      width={600}
      visible={visible}
      maskClosable={false}
      destroyOnClose
      title="批量关房"
      onOk={async () => {
        const formData = await form.validateFields();
        await services.RoomStateController.batchCloseRooms({
          ...formData,
          stateList,
        });
        onSubmit?.();
      }}
      onCancel={onClose}
    >
      <Form {...layoutConfig} form={form} preserve={false}>
        <FormItem
          label="关房类型"
          name="status"
          initialValue={10}
          rules={[{ required: true, message: '必填项' }]}
        >
          <Radio.Group>
            <Radio value={10}>停用房</Radio>
            <Radio value={9}>维修房</Radio>
            <Radio value={11}>保留房</Radio>
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
