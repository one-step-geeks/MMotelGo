import { Subject } from 'rxjs';

const subject = new Subject();

export const selectService = {
  sendSelectedInfo: (info: ROOM_STATE.SelectTableData) => {
    return subject.next({
      type: 'SELECTED',
      ...info,
    });
  },
  sendShowOrder: (info: { orderId: number }) => {
    return subject.next({
      type: 'SHOW_ORDER',
      ...info,
    });
  },
  sendCancelInfo: () => {
    return subject.next({
      type: 'CANCEL_SELECTED',
    });
  },
  sendAddOrder: () =>
    subject.next({
      type: 'ADD_ORDER',
    }),
  sendCloseRoom: () =>
    subject.next({
      type: 'CLOSE_ROOM',
    }),
  sendOpenRoom: () =>
    subject.next({
      type: 'OPEN_ROOM',
    }),
  sendRoomAsDirty: (info: { status: number; roomId: number }) =>
    subject.next({
      type: 'DIRTY_ROOM',
      ...info,
    }),
  sendRoomAsClean: (info: { status: number; roomId: number }) =>
    subject.next({
      type: 'CLEAN_ROOM',
      ...info,
    }),
  getSelectedInfo: () => subject.asObservable(),
};
