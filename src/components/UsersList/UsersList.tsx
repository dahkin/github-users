import React, { FC } from 'react';
import './UsersList.css';
import { UserAPI } from '../../types';
import { UsersItem } from '@components/UsersItem/UsersItem';

type Props = {
  users: UserAPI[];
};

export const UsersList: FC<Props> = ({ users }) => {
  return (
    <div className="users-list">
      {users.map((item: UserAPI) => (
        <UsersItem user={item} key={item.login} />
      ))}
    </div>
  );
};
