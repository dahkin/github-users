import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { UserAPI, LocationState } from '../../types';
import { UsersList } from '@components/UsersList/UsersList';
import { UsersListSkeleton } from '@components/UsersList/UsersListSkeleton';

export const UsersSearchPage: FC = () => {
  const { t } = useTranslation();
  // Get search query
  const location = useLocation<LocationState>();
  const params = new URLSearchParams(location.search);
  const query = params.get('query');

  const [users, setUsers] = React.useState<UserAPI[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

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
      });
  }, [query]);

  return (
    <main>
      <div className="container">
        {!loading ? (
          <>
            <h1 className="title" aria-live="polite">
              {users.length > 0 ? t('search_title', { name: query }) : t('search_empty_title', { name: query })}
            </h1>
            <UsersList users={users} />
          </>
        ) : (
          <>
            <h1 className="title" aria-live="polite">
              {t('search_loading_message')}...
            </h1>
            <UsersListSkeleton />
          </>
        )}
      </div>
    </main>
  );
};
