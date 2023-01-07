import React from 'react';
import { useIntl } from 'umi';

import './style.less';

interface PaymentSituationCardItemProps {
  price: number;
  label: string;
  iconUrl: string;
}
const PaymentSituationCardItem: React.FC<PaymentSituationCardItemProps> = (
  props,
) => {
  const intl = useIntl();
  const { price, iconUrl, label } = props;
  return (
    <div className="payment-situation-card-item">
      <img src={iconUrl} className="payment-situation-card-item-icon" />
      <div className="payment-situation-card-item-main">
        <div className="payment-situation-card-item-main-label">
          {intl.formatMessage({ id: label })}({intl.formatMessage({ id: '元' })}
          )
        </div>
        <div className="payment-situation-card-item-main-price">
          <div className="payment-situation-card-item-main-price-symbol">
            {intl.formatMessage({ id: '¥' })}
          </div>
          {price}
        </div>
      </div>
    </div>
  );
};

export default PaymentSituationCardItem;
