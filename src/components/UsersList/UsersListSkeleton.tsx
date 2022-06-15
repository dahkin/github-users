import React, { FC } from 'react';
import './UsersList.css';
import { UsersItemSkeleton } from '@components/UsersItem/UsersItemSkeleton';
import { repeat } from '../../utils';

export const UsersListSkeleton: FC = () => {
  return (
    <div className="users-list">
      {repeat(
        (i) => (
          <UsersItemSkeleton key={i} />
        ),
        12
      )}
    </div>
  );
};
