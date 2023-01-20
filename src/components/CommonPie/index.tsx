import React, { useState, useEffect } from 'react';
import { Pie, measureTextWidth, PieConfig } from '@ant-design/plots';
import { useIntl } from 'umi';

interface CommonPieProps {
  dataSource: {
    type: string;
    value: number;
  }[];
}
const renderStatistic = (
  containerWidth: number,
  text: string,
  style: { fontSize: number },
) => {
  const { width: textWidth, height: textHeight } = measureTextWidth(
    text,
    style,
  );
  const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

  let scale = 1;

  if (containerWidth < textWidth) {
    scale = Math.min(
      Math.sqrt(
        Math.abs(
          Math.pow(R, 2) /
            (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)),
        ),
      ),
      1,
    );
  }

  const textStyleStr = `width:${containerWidth}px;`;
  return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
    scale < 1 ? 1 : 'inherit'
  };">${text}</div>`;
};

const CommonPie: React.FC<CommonPieProps> = (props) => {
  const intl = useIntl();
  const { dataSource } = props;
  const $symbol = intl.formatMessage({ id: '¥' });
  const config: PieConfig = {
    width: 200,
    height: 200,
    data: dataSource,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.7,
    meta: {
      value: {
        formatter: (v: any) => `${v} ${$symbol}`,
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center',
      },
      autoRotate: false,
      content: '{value}',
    },
    legend: {
      position: 'bottom',
    },
    statistic: {
      title: {
        offsetY: -4,
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum ? datum.type : intl.formatMessage({ id: '总计' });
          return renderStatistic(d, text, {
            fontSize: 28,
          });
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '32px',
        },
        customHtml: (container, view, datum, data) => {
          const { width } = container.getBoundingClientRect();
          const text = datum
            ? `${$symbol} ${datum.value}`
            : `${$symbol} ${data?.reduce((r, d) => r + d.value, 0)}`;
          return renderStatistic(width, text, {
            fontSize: 32,
          });
        },
      },
    },
    // 添加 中心统计文本 交互
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
  };
  return <Pie {...config} />;
};

export default CommonPie;
