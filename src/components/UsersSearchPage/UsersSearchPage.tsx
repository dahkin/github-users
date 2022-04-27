import React, { FC } from 'react';
import { UsersList } from '../UsersList/UsersList';
import { useLocation } from 'react-router-dom';
import { UserAPI, LocationState } from '../../types';
import { getFullUsersInfo } from '../../utils';

export const UsersSearchPage: FC = () => {
  // Get search query
  const location = useLocation<LocationState>();
  const params = new URLSearchParams(location.search);
  const query = params.get('query');

  const [users, setUsers] = React.useState<UserAPI[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingRepos, setLoadingRepos] = React.useState<boolean>(true);

  // Fetch users by query
  React.useEffect(() => {
    setLoading(true);
    fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: new Headers({
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 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',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.items);
        setLoading(false);
        // Break if there are no results
        if (data.total_count === 0) {
          return;
        }
        // Fetch extra info for each user
        getFullUsersInfo(data.items, setUsers, setLoadingRepos);
      });
  }, [query]);

  return (
    <main>
      <div className="container">
        {!loading ? (
          <>
            <h1 className="title">
              {users.length > 0 ? 'Пользователи по запросу ' + query : 'Ничего не найдено по запросу ' + query}
            </h1>
            <UsersList users={users} loadingRepos={loadingRepos} />
          </>
        ) : (
          <h1 className="title">Поиск...</h1>
        )}
      </div>
    </main>
  );
};
