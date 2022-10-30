import { Avatar, Space, Select, Popover, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { setLocale, getLocale, getAllLocales, useHistory } from 'umi';
import { localeMap } from '@/constants';
import Cookie from 'js-cookie';

export default () => {
  const allLocales = getAllLocales();
  const history = useHistory();
  return (
    <Space>
      <Select
        value={getLocale()}
        options={allLocales?.map((locale) => ({
          label: localeMap.find((loc) => loc.value === locale)?.label,
          value: locale,
        }))}
        onChange={(locale) => {
          setLocale(locale, false);
        }}
      ></Select>
      <Popover
        placement="bottomRight"
        content={
          <Space direction="vertical">
            <Button
              type="link"
              size="small"
              onClick={() => {
                history.push('/pms/store');
              }}
            >
              门店列表
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                Cookie.remove('emailAddress');
                Cookie.remove('storeId');
                Cookie.remove('token');
                history.push('/user/login');
              }}
            >
              退出登录
            </Button>
          </Space>
        }
      >
        <Avatar size="small" icon={<UserOutlined />} />
      </Popover>
    </Space>
  );
};
