import { GetHashtagGraphResponse } from '../interfaces';
import { NetworkGraphProps } from 'modules/NetworkGraph/components/NetworkGraph.d';
import React from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import s from './Graph.module.css';
import useSwr from 'swr';
const NetworkGraph = dynamic(() => import('modules/NetworkGraph/components/NetworkGraph'), {
  ssr: false,
});

export type GraphProps = {
  hashtag?: string;
  width?: NetworkGraphProps['width'];
  height?: NetworkGraphProps['height'];
  onClickNode?: NetworkGraphProps['onClickNode'];
} & React.HTMLAttributes<HTMLDivElement>;

const Graph: React.FC<GraphProps> = ({
  children,
  className,
  hashtag,
  width = '100%',
  height = '600px',
  onClickNode,
  ...props
}) => {
  const { data, isValidating } = useSwr<GetHashtagGraphResponse>(`/api/graph/${hashtag}`);

  if (isValidating) {
    return (
      <div className={classNames(s.noData, className)} {...props}>
        loading graph...
      </div>
    );
  }

  if (!data || !data.url) {
    return (
      <div className={classNames(s.noData, className)} {...props}>
        No data found
      </div>
    );
  }

  return (
    <div className={classNames(s.wrapper, className)} {...props}>
      <NetworkGraph url={data.url} width={width} height={height} onClickNode={onClickNode} />
    </div>
  );
};

export default Graph;
