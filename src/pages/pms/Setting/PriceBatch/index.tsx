import React from 'react';
import { Result } from 'antd';
import { useIntl } from 'umi';

const BatchPricePage: React.FC = () => {
  const intl = useIntl();
  return (
    <Result
      status="404"
      subTitle={intl.formatMessage({ id: '建设中' })}
    ></Result>
  );
};

export default BatchPricePage;
