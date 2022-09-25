/* 发送异步请求，返回结果的类型 */
declare namespace API {
  interface Result<T = null> {
    success: boolean;
    errorCode: number;
    errorMessage: string;
    data: T;
  }

  interface Result_List_<T = null> {
    success: boolean;
    errorCode: number;
    errorMessage: string;
    data: {
      list?: T[];
      pageNum?: number;
      pageSize?: number;
      totalCount?: number;
      total?: number;
    };
  }

  interface Result_List_ALL_<T = null> {
    success: boolean;
    errorCode: number;
    errorMessage: string;
    data: T[];
  }
  // 全局-菜单，枚举，用户信息
  type Result_String_ = Result<string>;
  type Result_Number_ = Result<number>;
  type Result_String_Array_ = Result<string[]>;
  type Result_Number_Array_ = Result<number[]>;

  type Result_Setting_RoomTypeDetail_ = Result<SETTING.RoomType>;
  type Result_Setting_RoomTypeList_ = Result_List_<SETTING.RoomType>;
  type Result_Setting_HourRoomDetail_ = Result<SETTING.HourRoom>;
  type Result_Setting_HourRoomList_ = Result_List_<SETTING.HourRoom>;
  type Result_Setting_RoomGroupList_ = Result_List_<SETTING.RoomGroup>;
  type Result_Setting_IntervalNight_ = Result<{
    intervalNight: number;
  }>;

  type Result_Setting_RoomSortList_ = Result<SETTING.RoomSort[]>;
  type Result_Setting_RoomPriceList_ = Result_List_<SETTING.RoomPriceListData>;
  type Result_Setting_PriceCalendarList_ = Result_List_<SETTING.CalendarData>;
  type Result_Setting_PriceLogList_ = Result_List_<SETTING.PriceLog>;

  type Result_Setting_MakeNoteList_ = Result<{
    incomeList: SETTING.MakeNote[];
    expendList: SETTING.MakeNote[];
  }>;

  type Result_Setting_ConsumerItemList_ = Result_List_<SETTING.ConsumerItem>;

  // 房态看板
  type Result_RoomState_OrderList_ = Result_List_<ORDER.OrderData>;
  type Result_RoomState_RoomTypeList_ = Result_List_<ROOM_STATE.RoomType>;
  type Result_RoomState_StockList_ = Result_List_<ROOM_STATE.StockData>;
  type Result_RoomState_SingleDayList_ = Result_List_<ROOM_STATE.SingleDayData>;
  type Result_RoomState_RoomConditionList_ =
    Result_List_<ROOM_STATE.RoomCondition>;
  type Result_RoomState_RoomOverviewList_ =
    Result_List_<ROOM_STATE.RoomOverview>;
  type Result_RoomState_ChangeLogList_ =
    Result_List_<ROOM_STATE.StateChangeLog>;
  type Result_RoomState_StatusEnum_ = Result_List_<ROOM_STATE.StatusEnum>;
  type Result_RoomState_RoomTypeStatusList_ = Result<{
    roomTypeList: ROOM_STATE.RoomType[];
  }>;

  // 用户注册，登录，修改密码相关
  type Result_LoginInfo_ = Result<{
    token: string;
    storeList?: SYSTEM.StoreListInfo[];
  }>;
  type Result_PmsStoreList_ = Result_List_<SYSTEM.StoreListInfo>;
  type Result_PmsShopDetail_ = Result<SYSTEM.ShopDetail>;

  type Result_PmsAccountList_ = Result_List_<ACCOUNT.AccountData>;
  type Result_PmsAccountAuthorityList_ = Result<{
    menuAuthorityList: ACCOUNT.MenuAuthorityModule[];
    overAllAuthorityList: ACCOUNT.OverallAuthorityModule[];
  }>;
  type Result_PmsAccountDetail_ = Result<ACCOUNT.AccountDetail>;

  // 订单模块
  type Result_OrderDetailInfo_ = Result<ORDER.OrderDetail>;
  type Result_OrderListInfo_ = Result_List_<ORDER.OrderListItem>;
  type Result_RoomTypeInfo_ = Result<ORDER.TypeAndRoomTree>;
}
