import React from 'react';
import { useIntl } from 'umi';
import ProForm, { DrawerForm, ProFormText } from '@ant-design/pro-form';
interface EditChannelMailDrawerFormProps {
  trigger: JSX.Element;
}
const EditChannelMailDrawerForm: React.FC<EditChannelMailDrawerFormProps> = (
  props,
) => {
  const intl = useIntl();
  const [editChannelMailDrawerForm] = ProForm.useForm();

  const { trigger } = props;
  return (
    <DrawerForm
      width={500}
      title="渠道邮箱配置"
      form={editChannelMailDrawerForm}
      onVisibleChange={(open) => {
        if (open) {
        } else {
        }
      }}
      trigger={trigger}
    >
      <ProFormText
        name="email"
        label={intl.formatMessage({ id: '邮箱地址' })}
        rules={[{ required: true }]}
      />
      <ProFormText.Password
        name="password"
        label={intl.formatMessage({ id: '邮箱密码' })}
        rules={[{ required: true }]}
      />
    </DrawerForm>
  );
};

export default EditChannelMailDrawerForm;
