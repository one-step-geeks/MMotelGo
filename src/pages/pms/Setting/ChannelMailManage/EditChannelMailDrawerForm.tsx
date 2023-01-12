import React from 'react';
import { useIntl, useRequest } from 'umi';
import ProForm, { DrawerForm, ProFormText } from '@ant-design/pro-form';
import { addChannelMail, editChannelMail } from '@/services/ChannelController';
interface EditChannelMailDrawerFormProps {
  trigger: JSX.Element;
  id?: number;
  emailAddr?: string;
}
const EditChannelMailDrawerForm: React.FC<EditChannelMailDrawerFormProps> = (
  props,
) => {
  const intl = useIntl();
  const [editChannelMailDrawerForm] = ProForm.useForm();

  const { trigger, id, emailAddr } = props;
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
      onFinish={async (values) => {
        const { emailAddr, emailPwd } = values;
        if (id) {
          await editChannelMail({
            mailList: [{ id, emailPwd }],
          });
        } else {
          await addChannelMail({
            emailAddr,
            emailPwd,
          });
        }
        return true;
      }}
      trigger={trigger}
    >
      <ProFormText
        name="emailAddr"
        label={intl.formatMessage({ id: '邮箱地址' })}
        initialValue={emailAddr}
        disabled={!!emailAddr}
        rules={[{ required: true }]}
      />
      <ProFormText.Password
        name="emailPwd"
        label={intl.formatMessage({ id: '邮箱密码' })}
        rules={[{ required: true }]}
      />
    </DrawerForm>
  );
};

export default EditChannelMailDrawerForm;
