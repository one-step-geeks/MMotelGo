export default [
  {
    path: '/',
    redirect: 'pms/room-state/calendar',
  },
  {
    name: '首页',
    path: 'pms/home',
    component: 'pms/Home',
    hideInMenu: true,
  },
  {
    name: '房态',
    path: 'pms/room-state/calendar',
    component: 'pms/RoomState',
    // access: 'canSeeRouter',
    // mainMenuId: 1,
  },
  {
    name: '单日房态',
    path: 'pms/room-state/single-day',
    component: 'pms/RoomState/SingleDay',
    hideInMenu: true,
    // access: 'canSeeRouter',
    // mainMenuId: 1,
  },
  {
    name: '订单',
    path: 'pms/order',
    component: 'pms/Order',
    // access: 'canSeeRouter',
    // mainMenuId: 3,
    routes: [
      { path: '/pms/order/all', component: 'pms/Order/All' },
      { path: '/pms/order/unarrange', component: 'pms/Order/All' },
      { path: '/pms/order/unhandle', component: 'pms/Order/All' },
    ],
  },
  {
    path: 'pms/setting',
    exact: true,
    redirect: 'pms/setting/rooms-manage',
  },
  {
    name: '设置',
    path: 'pms/setting',
    component: 'pms/Setting',
    routes: [
      {
        path: '/pms/setting/channel-manage',
        component: 'pms/Setting/ChannelManage',
        access: 'canSeeSubRouter',
        subMenuId: 18,
      },
      {
        path: '/pms/setting/rooms-manage',
        component: 'pms/Setting/RoomType',
        access: 'canSeeSubRouter',
        subMenuId: 19,
      },
      // {
      //   path: '/pms/setting/rooms-hour',
      //   component: 'pms/Setting/HourRooms',
      //   access: 'canSeeSubRouter',
      //   subMenuId: 0,
      // },
      {
        path: '/pms/setting/rooms-group',
        component: 'pms/Setting/RoomGroup',
        access: 'canSeeSubRouter',
        subMenuId: 20,
      },
      {
        path: '/pms/setting/rooms-sort',
        component: 'pms/Setting/RoomSort',
        access: 'canSeeSubRouter',
        subMenuId: 21,
      },
      {
        path: '/pms/setting/consumer-item',
        component: 'pms/Setting/ConsumerItem',
        access: 'canSeeSubRouter',
        subMenuId: 22,
      },
      {
        path: '/pms/setting/price-manage',
        component: 'pms/Setting/PriceCalendar',
        access: 'canSeeSubRouter',
        subMenuId: 23,
      },
      {
        path: '/pms/setting/price-batch',
        component: 'pms/Setting/PriceBatch',
        access: 'canSeeSubRouter',
        subMenuId: 24,
      },
      {
        path: '/pms/setting/price-log',
        component: 'pms/Setting/PriceChangeLog',
        access: 'canSeeSubRouter',
        subMenuId: 25,
      },
      {
        path: '/pms/setting/shop-manage',
        component: 'pms/Setting/ShopManage',
        access: 'canSeeSubRouter',
        subMenuId: 30,
      },
      {
        path: '/pms/setting/financial-payment',
        component: 'pms/Setting/FinancialPayment',
        access: 'canSeeSubRouter',
        subMenuId: 27,
      },
      {
        path: '/pms/setting/financial-note',
        component: 'pms/Setting/FinancialNote',
        access: 'canSeeSubRouter',
        subMenuId: 28,
      },
      {
        path: '/pms/setting/account-list',
        component: 'pms/Setting/AccountManage',
        access: 'canSeeSubRouter',
        subMenuId: 26,
      },
      {
        path: '/pms/setting/account-list/add-or-edit',
        component: 'pms/Setting/AccountManage/Edit',
        access: 'canSeeRouter',
        mainMenuId: 9,
      },
      {
        path: '/pms/setting/account-list/add-or-edit/:accountId',
        component: 'pms/Setting/AccountManage/Edit',
        access: 'canSeeRouter',
        mainMenuId: 9,
      },
    ],
  },
  {
    name: '酒店列表',
    path: 'pms/store',
    component: 'pms/Store',
    hideInMenu: true,
    layout: {
      hideMenu: true, //  隐藏边栏
      hideNav: true, // 隐藏顶部导航
      hideFooter: true, // 隐藏底部底栏
    },
  },
  {
    name: '登录',
    path: 'user/login',
    component: 'user/Login',
    hideInMenu: true,
    layout: {
      hideMenu: true, //  隐藏边栏
      hideNav: true, // 隐藏顶部导航
      hideFooter: true, // 隐藏底部底栏
    },
  },
  {
    name: '注册账号',
    path: 'user/regist',
    hideInMenu: true,
    layout: {
      hideMenu: true, //  隐藏边栏
      hideNav: true, // 隐藏顶部导航
      hideFooter: true, // 隐藏底部底栏
    },
    component: 'user/Regist',
  },
  {
    name: '忘记密码',
    path: 'user/reset_password',
    hideInMenu: true,
    layout: {
      hideMenu: true, //  隐藏边栏
      hideNav: true, // 隐藏顶部导航
      hideFooter: true, // 隐藏底部底栏
    },
    component: 'user/ResetPassword',
  },
  {
    name: '404',
    redirect: 'user/login',
  },
];
