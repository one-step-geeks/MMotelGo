import type { MenuDataItem } from '@ant-design/pro-layout';
/**
 * 在这里按照初始化数据定义项目中的权限，统一管理
 */
export default (initialState: SYSTEM.InitialState) => {
  const { menuAuthorityList, overAllAuthorityList } = initialState || {};
  const mainMenuList = menuAuthorityList?.reduce((all, module) => {
    return [...all, ...module.mainMenuList];
  }, [] as ACCOUNT.MainMenu[]);
  return {
    canSeeRouter: (route: MenuDataItem) => {
      return mainMenuList?.find((main) => main.mainMenuId === route.mainMenuId);
    },
  };
};
