import type { MenuDataItem } from '@ant-design/pro-layout';
/**
 * 在这里按照初始化数据定义项目中的权限，统一管理
 */
export default (initialState: SYSTEM.InitialState) => {
  const { menuAuthorityList, overAllAuthorityList } = initialState || {};

  // 所有主菜单
  const mainMenuList = menuAuthorityList?.reduce((all, module) => {
    return [...all, ...module.mainMenuList];
  }, [] as ACCOUNT.MainMenu[]);

  // 所有子菜单
  const subMenuList = mainMenuList?.reduce((all, main) => {
    return [...all, ...main.subMenuList];
  }, [] as ACCOUNT.SubMenu[]);

  return {
    canSeeRouter: (route: MenuDataItem) => {
      return !!mainMenuList?.find(
        (main) => main.mainMenuId === route.mainMenuId,
      );
    },
    canSeeSubRouter: (route: MenuDataItem) => {
      return !!subMenuList?.find((sub) => sub.menuId === route.subMenuId);
    },
    canSeeSubMenu: (menuId: number) => {
      return !!subMenuList?.find((sub) => sub.menuId === menuId);
    },
  };
};
