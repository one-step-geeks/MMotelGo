import { Form, Radio, Modal, Input } from 'antd';
import { useModel } from 'umi';
import services from '@/services';
import { selectService } from './service';

const FormItem = Form.Item;

interface Props {
  onClose?: () => void;
  visible: boolean;
}

const layoutConfig = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

interface CloseRoomInfo {
  dateList: string[];
  roomId: Key;
}

function processRoomParams(list: ROOM_STATE.SelectTableData[]) {
  const result: CloseRoomInfo[] = [];
  for (let i = 0; i < list.length; i++) {
    const state = list[i];
    const finded = result.find((item) => item.roomId === state.roomId);
    if (finded) {
      finded.dateList = [...finded?.dateList, state.date];
    } else {
      result.push({
        roomId: state.roomId,
        dateList: [state.date],
      });
    }
  }
  return result;
}

const CloseRoomModal: React.FC<Props> = (props) => {
  const { visible, onClose } = props;
  const { selectedRooms, setSelectedRooms } = useModel('state');
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
        await services.RoomStateController.batchCloseOrOpenRooms({
          ...formData,
          stateList: processRoomParams(selectedRooms),
        });
        setSelectedRooms([]);
        selectService.sendCancelInfo();
        onClose?.();
      }}
      onCancel={onClose}
    >
      <Form {...layoutConfig} form={form}>
        <FormItem
          label="关房类型"
          name="status"
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
