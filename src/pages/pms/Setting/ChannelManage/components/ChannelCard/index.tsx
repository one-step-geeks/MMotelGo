import { useState } from 'react';
import { Space, Input, Popconfirm, message, Dropdown, Menu } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import services from '@/services';
import './style.less';

interface Props {
  value: SETTING.Channel;
  onChange: () => void;
}

const colorOptions = [
  { text: '默认颜色', value: 'rgb(51, 51, 51)' },
  { text: '携程蓝', value: 'rgb(49, 141, 243)' },
  { text: '小红书红', value: 'rgb(254, 91, 94)' },
  { text: '爱彼迎红', value: 'rgb(236, 52, 94)' },
  { text: '途家橙', value: 'rgb(255, 125, 51)' },
  { text: '飞猪黄', value: 'rgb(255, 158, 0)' },
  { text: '美团黄', value: 'rgb(255, 184, 0)' },
  { text: 'booking蓝', value: 'rgb(15, 65, 137)' },
  { text: '天蓝', value: 'rgb(0, 137, 220)' },
  { text: '微信绿', value: 'rgb(54, 192, 110)' },
  { text: '抖音黑', value: 'rgb(0, 0, 0)' },
  { text: '美宿紫', value: 'rgb(219, 90, 127)' },
  { text: '快手红', value: 'rgb(223, 115, 94)' },
];

export default (props: Props) => {
  const { value, onChange } = props;
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(props.value.id ? false : true);

  const handleOnSave = async () => {
    if (name && name.trim()) {
      await services.ChannelController.addChannel(name);
      message.success('新增成功');
      onChange();
      setEditing(false);
    } else {
      message.warn('名称不能为空');
    }
  };

  const handleOnUpdate = async () => {
    if (name && name.trim()) {
      await services.ChannelController.updateChannel(
        value.id!,
        name,
        value.color as string,
      );
      message.success('修改成功');
      onChange();
      setEditing(false);
    } else {
      message.warn('名称不能为空');
    }
  };

  const handleOnCancel = () => {
    setEditing(false);
  };

  const handleOnDelete = async () => {
    await services.ChannelController.deleteChannel(value.id!);
    message.success('删除成功');
    onChange();
  };

  const canEdit = value.acquiesce !== 1; // 1 是默认

  const menu = (
    <Menu
      items={colorOptions.map((op) => ({
        key: op.text,
        label: (
          <div
            onClick={async () => {
              await services.ChannelController.updateChannel(
                value.id!,
                value.name,
                op.value,
              );
              message.success('修改颜色成功');
              onChange();
              // console.log('select', op.value)
            }}
          >
            {/* TODO 全局属性设置 */}
            <span
              className="color-brick"
              style={{
                backgroundColor: op.value,
                display: 'inline-block',
                width: '16px',
                height: '16px',
                verticalAlign: 'middle',
                marginRight: '8px',
              }}
            ></span>
            <span>{op.text}</span>
          </div>
        ),
      }))}
    ></Menu>
  );

  return (
    <div className="financial-payment-card">
      {editing ? (
        <div className="content">
          <Input
            className="text-input"
            defaultValue={value.name}
            onChange={(e) => setName(e.target.value)}
            maxLength={10}
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
          <Dropdown trigger={['click']} overlay={menu}>
            <span
              style={{ backgroundColor: value.color }}
              className="color-brick"
            ></span>
          </Dropdown>

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
