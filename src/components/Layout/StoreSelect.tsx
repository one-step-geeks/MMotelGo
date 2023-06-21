import { Select } from 'antd';
import { getLocale, useRequest, useModel, useHistory } from 'umi';
import services from '@/services';
import Cookie from 'js-cookie';

export default () => {
  const { refresh } = useModel('@@initialState');
  const history = useHistory();
  const { data } = useRequest(() => {
    return services.UserController.getPmsStoreList().then((res) => {
      return res;
    });
  });
  const selectStore = async (storeId: any) => {
    Cookie.set('storeId', storeId);
    await services.UserController.bindPmsStoreToken();
    refresh();
    history.replace('/');
  };

  return (
    <Select
      value={Cookie.get('storeId')}
      style={{ width: 200 }}
      options={data?.list?.map((item) => ({
        label: item.storeName,
        value: `${item.storeId}`,
      }))}
      onChange={(storeId) => {
        selectStore(storeId);
      }}
    ></Select>
  );
};
