import React, { memo } from 'react';
import { Tooltip, Typography } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { QuestionCircleOutlined } from '@ant-design/icons';

import './style.less';

interface CommonCardProps {
  tooltip?: React.ReactNode;
  tooltipIcon?: React.ReactNode;
  title: React.ReactNode;
  loading?: boolean;
  titleTool?: React.ReactNode;
  subTitle?: React.ReactNode;
  children?: React.ReactNode;
}

const CommonCard: React.FC<CommonCardProps> = (props) => {
  const {
    children,
    tooltip,
    tooltipIcon,
    title,
    subTitle,
    titleTool,
    loading,
  } = props;
  return (
    <div className="common-card">
      <div className="common-card-header">
        <div className="common-card-header-main">
          {title && (
            <Typography.Text className="common-card-header-title">
              {title}
            </Typography.Text>
          )}
          {subTitle && (
            <Typography.Text
              type="secondary"
              className="common-card-header-subtitle"
            >
              {subTitle}
            </Typography.Text>
          )}
          {tooltip && (
            <Tooltip title={tooltip}>
              {tooltipIcon || <QuestionCircleOutlined />}
            </Tooltip>
          )}
        </div>
        <div className="common-card-header-tool">{titleTool}</div>
      </div>
      <ProCard loading={loading} className="common-card-content">
        {children}
      </ProCard>
    </div>
  );
};

export default memo(CommonCard);
