import React, { Dispatch, FC, SetStateAction } from 'react';
import { UsersList } from '../UsersList/UsersList';
import { UsersListSkeleton } from '../UsersList/UsersListSkeleton';
import { UserAPI } from '../../types';

interface Props {
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export const UsersPage: FC<Props> = ({ setSearchValue }) => {
  const [users, setUsers] = React.useState<UserAPI[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setSearchValue('');
    setLoading(true);
    fetch('https://api.github.com/users', {
      headers: new Headers({
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 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',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <div className="container">{loading ? <UsersListSkeleton /> : <UsersList users={users} />}</div>
    </main>
  );
};
