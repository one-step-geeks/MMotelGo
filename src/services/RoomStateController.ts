import { request } from 'umi';

/** 查询房态日历 */
export async function getRoomStateStock(params?: {
  startDate?: string; //房态看板起始时间
  endDate?: string; //房态看板结束时间
  list?: number[]; //房型房间
}) {
  return request<API.Result_RoomState_StockList_>(
    '/motel/roomState/calendar/allStateRoomStock',
    {
      method: 'POST',
      data: params,
    },
  );
}

/** 查询房型房间列表 */
export async function getAllRoomType(params: {
  startDate?: string; //房态看板起始时间
  endDate?: string; //房态看板结束时间
  list?: number[]; //房型房间
}) {
  return request<API.Result_RoomState_RoomTypeList_>(
    '/motel/roomState/calendar/allState',
    {
      method: 'POST',
      data: params,
    },
  );
}

/** 查询房间订单 */
export async function getAllRoomOrder(params: {
  startDate: string;
  endDate: string;
}) {
  return request<API.Result_RoomState_OrderList_>(
    '/motel/roomState/calendar/allStateOrder',
    {
      method: 'POST',
      data: params,
    },
  );
}

/** 查询房情表 */
export async function getRoomSituation(params: {
  startTime?: string;
  current?: number;
  pageSize?: number;
}) {
  return request<API.Result_RoomState_RoomConditionList_>(
    '/motel/roomState/condition/allCondition',
    {
      method: 'POST',
      data: {
        ...params,
        pageNum: params.current,
      },
    },
  );
}

/** 查询今日概览 */
export async function getTodayOverview(params: {
  status?: string; // 1-今日预抵；2-今日预离；3-当前在住；4-未排房
  current?: number;
  pageSize?: number;
}) {
  return request<API.Result_RoomState_RoomOverviewList_>(
    '/motel/roomState/currentOverview/allState',
    {
      method: 'GET',
      params: {
        ...params,
        pageNum: params.current,
      },
    },
  );
}

/** 查询房态操作日志 */
export async function getRoomStateChangeLog(params: {
  status?: number;
  current?: number;
  pageSize?: number;
  roomCode?: string; //房间号
  startTime?: string; //房态操作开始时间
  endTime?: string; //房态操作结束时间
}) {
  return request<API.Result_RoomState_ChangeLogList_>(
    '/motel/roomState/log/allLog',
    {
      method: 'POST',
      data: {
        ...params,
        pageNum: params.current,
      },
    },
  );
}

/** 查询单日房态 */
export async function getSingleDayRoomState(params: {
  stateDate?: string; //单日房态时间
  roomTypeId?: number; //房型id，如果等于0代表所有房型
  sortType?: number; // 1-按房型排序 2-按房间排序 3-按房间分组排序
  statusList?: number[];
}) {
  return request<API.Result_RoomState_SingleDayList_>(
    '/motel/roomState/calendar/singleDayState',
    {
      method: 'POST',
      data: {
        ...params,
      },
    },
  );
}

/** 查询房态枚举 */
export async function getRoomStatusEnum(params?: {}) {
  return request<API.Result_RoomState_StatusEnum_>(
    '/motel/roomState/calendar/roomStatusList',
    {
      method: 'GET',
      params,
    },
  );
}

/** 批量关房 */
export async function batchCloseRooms(params?: {
  remark?: string;
  status?: number;
  stateList: {
    dateList: string[];
    roomId: string;
  }[];
}) {
  return request<API.Result>('/motel/roomState/calendar/batchClose', {
    method: 'POST',
    data: params,
  });
}

/** 批量开房 */
export async function batchOpenRooms(params?: {
  stateList: ROOM_STATE.CloseRoomInfo[];
}) {
  return request<API.Result>('/motel/roomState/calendar/batchOpen', {
    method: 'POST',
    data: params,
  });
}

/** 脏房 | 净房转换 */
export async function changeRoomStatus(params?: {
  roomId?: Key;
  status: number;
}) {
  return request<API.Result>('/motel/roomState/calendar/roomStatusChange', {
    method: 'POST',
    data: params,
  });
}

/** 房间状态（脏房 | 净房） */
export async function getRoomStatusList(params?: { roomTypeIdList: number[] }) {
  return request<API.Result_RoomState_RoomTypeStatusList_>(
    '/motel/roomState/calendar/roomStatusList',
    {
      method: 'POST',
      data: params,
    },
  );
}
