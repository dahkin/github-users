import React, { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Image } from '@components/Image/Image';
import './UsersItem.css';
import { UserAPI } from '../../types';

type Props = {
  user: UserAPI;
};

export const UsersItem: FC<Props> = ({ user }) => {
  const [loadingRepos, setLoadingRepos] = React.useState<boolean>(true);
  const [userData, setUserData] = React.useState<Partial<UserAPI>>({});

  useEffect(() => {
    setLoadingRepos(true);
    fetch(`https://api.github.com/users/${user.login}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData({ company: data.company, repos: data.public_repos });
        setLoadingRepos(false);
      });
  }, []);

  const repositoriesView = () => userData.repos != null && t('repositories_number', { count: userData.repos });

  const { t } = useTranslation();
  return (
    <article className="users-list__item" key={user.login}>
      <div className="users-list__image-container">
        <Image className="users-list__image" src={user.avatar_url} alt={t('profile_photo', { name: user.login })} />
      </div>
      <div className="users-list__content">
        <h2 className="users-list__title">
          <Link to={`/users/${user.login}`} className="link" aria-label={t('profile_page_link', { name: user.login })}>
            {user.login}
          </Link>
          {', '}
          {loadingRepos ? <div className="loading-view skeleton-gradient" /> : repositoriesView()}
        </h2>
        {userData.company && <p className="users-list__text">{userData.company}</p>}
      </div>
    </article>
  );
};
