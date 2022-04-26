/* 发送异步请求，返回结果的类型 */
declare namespace API {
  enum ACTION {
    ADD,
    UPDATE,
  }

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
    };
  }

  // 全局-菜单，枚举，用户信息
  type Result_String_ = Result<string>;
  type Result_Number_ = Result<number>;
  type Result_String_Array_ = Result<string[]>;
  type Result_Number_Array_ = Result<number[]>;

  type Result_LoginInfo_ = Result<SYSTEM.UserInfo>;
  type Result_Setting_RoomTypeDetail_ = Result<SETTING.RoomType>;
  type Result_Setting_RoomTypeList_ = Result_List_<SETTING.RoomType>;
  type Result_Setting_HourRoomDetail_ = Result<SETTING.HourRoom>;
  type Result_Setting_HourRoomList_ = Result_List_<SETTING.HourRoom>;
  type Result_Setting_RoomGroupList_ = Result_List_<SETTING.RoomGroup>;

  type Result_Setting_RoomSortList_ = Result_List_<SETTING.RoomSort>;
  type Result_Setting_RoomPriceList_ = Result_List_<SETTING.RoomPriceListData>;
}