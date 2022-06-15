import React, { FC } from 'react';
import { Image } from '@components/Image/Image';
import './UsersItem.css';
import { SkeletonText } from '@components/SkeletonText/SkeletonText';

export const UsersItemSkeleton: FC = () => {
  return (
    <article className="users-list__item">
      <div className="users-list__image-container">
        <Image className="users-list__image" skeleton />
      </div>
      <div className="users-list__content">
        <h2 className="users-list__title">
          <SkeletonText accent />
        </h2>
        <SkeletonText rowsCount={2} />
      </div>
    </article>
  );
};
