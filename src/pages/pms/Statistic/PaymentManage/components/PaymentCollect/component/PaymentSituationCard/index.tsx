import React, { useContext } from 'react';
import { useIntl } from 'umi';
import PaymentSituationCardItem from './PaymentSituationCardItem';
import CommonCard from '@/components/CommonCard';
import { PaymentCollectContext } from '../../context';
import refundIcon from '@/assets/images/退款管理.png';
import netReceiptsIcon from '@/assets/images/收款认领.png';
import receiptsIcon from '@/assets/images/新增收款.png';
import './style.less';

const PaymentSituationCard: React.FC = () => {
  const intl = useIntl();
  const { store } = useContext(PaymentCollectContext);
  const { paymentSurvey, paymentSurveyLoading } = store;
  return (
    <div className="payment-situation">
      <CommonCard
        loading={paymentSurveyLoading}
        title={intl.formatMessage({ id: '收款概况' })}
        subTitle={intl.formatMessage({ id: '统计说明' })}
        tooltip={
          <div>
            <div>
              {intl.formatMessage({
                id: 'a.数据统计时，按每条消费记录的发生时间进行统计，而不是您操作录入的时间',
              })}
            </div>
            <div>
              {intl.formatMessage({
                id: 'b.统计所有订单内有效的记录，您删除的记录，取消的房费将不被统计',
              })}
            </div>
            <div>
              {intl.formatMessage({
                id: 'c.本统计与收款无关，记一笔数据不统计',
              })}
            </div>
          </div>
        }
      >
        <div className="payment-situation-card-warp">
          <PaymentSituationCardItem
            iconUrl={netReceiptsIcon}
            label="净收款"
            price={(paymentSurvey.netReceipts || 0).toFixed(2)}
          />
          <PaymentSituationCardItem
            iconUrl={receiptsIcon}
            label="总收款"
            price={(paymentSurvey.totalAmount || 0).toFixed(2)}
          />
          <PaymentSituationCardItem
            iconUrl={refundIcon}
            label="总退款"
            price={(paymentSurvey.totalRefund || 0).toFixed(2)}
          />
        </div>
      </CommonCard>
    </div>
  );
};

export default PaymentSituationCard;
