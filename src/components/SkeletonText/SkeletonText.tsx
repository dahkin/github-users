import React, { FC } from 'react';
import classNames from 'classnames';
import './SkeletonText.css';
import { repeat } from '../../utils';

interface SkeletonTextProps {
  rowsCount?: number;
  accent?: boolean;
}

export const SkeletonText: FC<SkeletonTextProps> = ({ accent = false, rowsCount = 1 }: SkeletonTextProps) => {
  return (
    <span
      className={classNames('skeleton-text', {
        'skeleton-text--accent': accent,
      })}
    >
      {repeat((i) => {
        return <span key={i} className="skeleton-text__row skeleton-gradient" />;
      }, rowsCount)}
    </span>
  );
};
