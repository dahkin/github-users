import React, { Dispatch, FC, SetStateAction } from 'react';
import { UsersList } from '../UsersList/UsersList';
import { UserAPI } from '../../types';
import { getFullUsersInfo } from '../../utils';

interface Props {
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export const UsersPage: FC<Props> = ({ setSearchValue }) => {
  const [users, setUsers] = React.useState<UserAPI[]>([]);
  const [loadingRepos, setLoadingRepos] = React.useState<boolean>(true);

  React.useEffect(() => {
    setSearchValue('');
    fetch('https://api.github.com/users', {
      headers: new Headers({
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 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',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        getFullUsersInfo(data, setUsers, setLoadingRepos);
      });
  }, []);

  return (
    <main>
      <div className="container">
        <UsersList users={users} loadingRepos={loadingRepos} />
      </div>
    </main>
  );
};
