import React from 'react';

interface IProps {
  value: number;
  percent?: boolean;
  locale?: string;
  precision?: number;
  options?: any;
}

export const formatNumber = ({
  value,
  locale = 'en-US',
  percent = false,
  precision = 2,
  options = {},
}: any) => {
  let enhancedOptions = {
    ...options,
    maximumFractionDigits: precision,
  };

  if (!value && typeof value !== 'number') {
    return '-';
  }

  if (percent) {
    enhancedOptions = {
      ...enhancedOptions,
      style: 'percent',
    };
  }

  return value.toLocaleString(locale, enhancedOptions);
};

const Number = ({
  value,
  locale = 'en-US',
  percent = false,
  precision = 2,
  options = {},
  ...props
}: IProps) => {
  const numberStr = formatNumber({ value, locale, percent, precision, options });

  return <span {...props}>{numberStr}</span>;
};

export default Number;
