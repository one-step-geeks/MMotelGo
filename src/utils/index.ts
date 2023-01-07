import moment from 'moment';
import { history, useIntl } from 'umi';
import { RangeValue } from 'rc-picker/lib/interface';
import { PaymentCollectStateType } from '@/pages/pms/Statistic/PaymentManage/components/PaymentCollect/interface';

export const getWeekDay = (date: moment.Moment) => {
  const intl = useIntl();
  const intlKey = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][
    date.day()
  ];
  return intl.formatMessage({ id: intlKey });
};

// 生成连续30天的日期
export const getCalendarDate = (
  days: number,
  from?: string | moment.Moment,
) => {
  const result = [];
  for (let i = 0; i < days; i++) {
    result.push({
      date: moment(from).add(i, 'd').format('YYYY-MM-DD'),
    });
  }
  return result;
};

export const isLoginPath = () => {
  const pathname = history.location.pathname;
  if (
    pathname === '/user/login' ||
    pathname === '/user/regist' ||
    pathname === '/user/regist-success' ||
    pathname === '/user/reset_password'
  ) {
    return true;
  }
  return false;
};

export const bufferDownload = (buffer: ArrayBuffer, filename: string) => {
  const blob = new Blob([buffer]);
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const transformRangeDate = (
  collectDateRange: RangeValue<moment.Moment>,
) => {
  const [start, end] = collectDateRange || [];
  const rangeDayList = [];
  if (start && end) {
    const newStart = start.clone();
    while (true) {
      rangeDayList.push(newStart.format('YYYY-MM-DD'));
      if (newStart.isSame(end, 'day')) {
        break;
      }
      newStart.add(1, 'day');
    }
  }
  return rangeDayList;
};

export const getRangeDate = (
  collectDateRange: PaymentCollectStateType['collectDateRange'],
) => {
  const [start, end] = collectDateRange || [];
  if (start && end) {
    return {
      startTime: start.hour(0).minute(0).second(0).millisecond(0).valueOf(),
      endTime: end.hour(23).minute(59).second(59).millisecond(999).valueOf(),
    };
  }
  return {} as any;
};
