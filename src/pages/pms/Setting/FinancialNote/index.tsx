import { useState, useEffect } from 'react';
import SortableNoteItem from './components/SortableNoteItem';
import { NoteTypeEnum } from './components/NoteItem';
import { editingService } from './components/service';
import { Card, Button, Skeleton, Empty } from 'antd';
import { useRequest, useIntl } from 'umi';
import services from '@/services';

export default () => {
  const intl = useIntl();
  const [editing, setEditing] = useState(false);
  const [incomeList, setIncomeList] = useState<SETTING.MakeNote[]>([]);
  const [expendList, setExpendList] = useState<SETTING.MakeNote[]>([]);

  const { loading, run } = useRequest(async () => {
    return services.SettingController.getMakeNoteList().then((res) => {
      setIncomeList(res?.data?.incomeList || []);
      setExpendList(res?.data?.expendList || []);
    });
  });

  useEffect(() => {
    const subs = editingService.getEditingInfo().subscribe((info: any) => {
      switch (info.type) {
        case 'IS_EDITING':
          setEditing(true);
          break;
        case 'EDITING_DONE':
          setEditing(false);
          run();
          break;
        case 'EDITING_CANCEL':
          if (info.cancelType === NoteTypeEnum.INCOME) {
            setIncomeList(incomeList.filter((item) => item.id !== -1));
          }
          if (info.cancelType === NoteTypeEnum.EXPAND) {
            setExpendList(expendList.filter((item) => item.id !== -1));
          }
          setEditing(false);
          break;
        default:
          break;
      }
    });

    return () => {
      subs.unsubscribe();
    };
  }, [incomeList, expendList]);

  return (
    <Skeleton loading={loading}>
      <Card
        title={intl.formatMessage({ id: '收入项' })}
        extra={
          <Button
            type="primary"
            disabled={editing}
            onClick={() => {
              setEditing(true);
              setIncomeList([...incomeList, { id: -1 }]);
            }}
          >
            {intl.formatMessage({ id: '添加' })}
          </Button>
        }
      >
        {incomeList?.length ? (
          <SortableNoteItem
            type={NoteTypeEnum.INCOME}
            disabled={editing}
            dataSource={incomeList}
          />
        ) : (
          <Empty />
        )}
      </Card>
      <Card
        title={intl.formatMessage({ id: '支出项' })}
        style={{ marginTop: 24 }}
        extra={
          <Button
            type="primary"
            disabled={editing}
            onClick={() => {
              setEditing(true);
              setExpendList([...expendList, { id: -1 }]);
            }}
          >
            {intl.formatMessage({ id: '添加' })}
          </Button>
        }
      >
        {expendList?.length ? (
          <SortableNoteItem
            type={NoteTypeEnum.EXPAND}
            disabled={editing}
            dataSource={expendList}
          />
        ) : (
          <Empty />
        )}
      </Card>
    </Skeleton>
  );
};
