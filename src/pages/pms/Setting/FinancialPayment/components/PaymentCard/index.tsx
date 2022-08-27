import { useState } from 'react';
import { Space, Input, Popconfirm, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import services from '@/services';
import './style.less';

interface Props {
  value: SETTING.PaymentType;
  onChange: () => void;
}

export default (props: Props) => {
  const { value, onChange } = props;
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(props.value.id ? false : true);

  const handleOnSave = async () => {
    await services.FinanceController.addPaymentType(name);
    message.success('新增成功');
    onChange();
    setEditing(false);
  };

  const handleOnUpdate = async () => {
    await services.FinanceController.updatePaymentType(value.id!, name);
    message.success('修改成功');
    onChange();
    setEditing(false);
  };

  const handleOnCancel = () => {
    setEditing(false);
  };

  const handleOnDelete = async () => {
    await services.FinanceController.deletePaymentType(value.id!);
    message.success('删除成功');
    onChange();
  };

  const canEdit = value.acquiesce !== 1; // 1 是默认

  return (
    <div className="financial-payment-card">
      {editing ? (
        <div className="content">
          <Input
            className="text-input"
            defaultValue={value.name}
            onChange={(e) => setName(e.target.value)}
          />
          <Space className="action">
            <CheckOutlined
              className="pointer"
              onClick={value.id ? handleOnUpdate : handleOnSave}
              style={{ color: 'green' }}
            />
            {/* cancel editing vs refresh list(to remove draft item) */}
            <CloseOutlined
              className="pointer"
              style={{ color: 'red' }}
              onClick={value.id ? handleOnCancel : onChange}
            />
          </Space>
        </div>
      ) : (
        <div className={canEdit ? 'content' : 'content  corner'}>
          <span className="text">{value.name}</span>
          {canEdit ? (
            <Space className="action">
              <EditOutlined
                className="pointer"
                onClick={() => {
                  setName(value.name);
                  setEditing(true);
                }}
              />
              <Popconfirm
                title="确定要删除吗？"
                placement="bottom"
                okText="是"
                cancelText="否"
                onConfirm={handleOnDelete}
              >
                <DeleteOutlined className="pointer" />
              </Popconfirm>
            </Space>
          ) : null}
        </div>
      )}
    </div>
  );
};
