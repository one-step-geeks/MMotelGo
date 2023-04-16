import React from 'react';
import { useIntl } from 'umi';
import ProForm, { DrawerForm, ProFormText } from '@ant-design/pro-form';
import { addChannelMail, editChannelMail } from '@/services/ChannelController';
import { ProCard } from '@ant-design/pro-components';
interface EditChannelMailDrawerFormProps {
  trigger: JSX.Element;
  id?: number;
  emailAddr?: string;
  onFinish?: () => any;
}
const EditChannelMailDrawerForm: React.FC<EditChannelMailDrawerFormProps> = (
  props,
) => {
  const intl = useIntl();
  const [editChannelMailDrawerForm] = ProForm.useForm();

  const { trigger, id, emailAddr, onFinish } = props;
  return (
    <DrawerForm
      width={500}
      title={intl.formatMessage({ id: '渠道邮箱配置' })}
      form={editChannelMailDrawerForm}
      onVisibleChange={(open) => {
        if (open) {
          editChannelMailDrawerForm.setFieldsValue({
            emailAddr,
            emailPwd: null,
          });
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
        onFinish && onFinish();
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
        label={intl.formatMessage({ id: '邮箱授权码' })}
        rules={[{ required: true }]}
      />
      <ProCard
        title={intl.formatMessage({ id: '注意' })}
        collapsible
        className="add-channel-email-notoce"
        defaultCollapsed
        bordered
        headerBordered
      >
        {intl.formatMessage({
          id: `邮箱授权码是保护用户邮件隐私的一种方式。
          谷歌gmail:要获取谷歌邮箱授权码，用户需要登录账户并进入“安全性”设置页面。
          在此页面中，用户需启用两步验证功能，并创建一个应用程序密码，该密码将作为授权码。
          在创建过程中，用户需要选择应用程序(例如“Outlook")，操作系统(Windows、 Android等)和针对该应用程序的授权码。
          用户还需要确认哪一个谷歌账户将使用该授权码。
        
          2.雅虎邮箱:要获取雅虎邮箱的授权码，用户需要登录账户并进入“安全性”选项卡。
          在此页面中，用户需要单击"生成密码”按钮，并为其授权码设置一个自定义名称。
          用户将要在用于获取授权码的应用程序中使用该密码。
          用户还可以在此页面中，监控从该账户发出的所有会话，以确保账户安全。
          
          3.微软Outlook邮箱:要获取微软Outlook邮件的授权码，用户需在邮箱页面中打开“文件>信息>账户设置>账户设置"，
          然后单击“更改”按钮。在此页面中，用户需要选择他们要使用的电子邮件账户，
          并单击“更改”按钮。在“更改电子邮件设置"页面中，用户需要单击“更改”按钮，然后单击“其他设置”。
          在授权类别中，用户需要单击“生成授权码"按钮，该授权码将作为用户邮箱的应用程序密
          码。
          其他邮箱授权码有些许的不同，但大部分流程是类似的，
          需要在邮箱的“安全”或“设置”选项中生成。可以防止他人恶意登陆账户进而操作邮件，保护用户的个人信息安全，
          如果不清楚您的邮箱授权码如何获取，可以google一下。`,
        })}
      </ProCard>
    </DrawerForm>
  );
};

export default EditChannelMailDrawerForm;
