import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import './UsersList.css';
import { UserAPI } from '../../types';
import { numberDeclination } from '../../utils';

type Props = {
  users: UserAPI[];
  loadingRepos: boolean;
};

export const UsersList: FC<Props> = ({ users, loadingRepos }) => {
  return (
    <div className="users-list">
      {users.map((item: UserAPI) => (
        <section className="users-list__item" key={item.login}>
          <div className="users-list__image-container">
            <img className="users-list__image" src={item.avatar_url} alt="defunkt profile photo" />
          </div>
          <div className="users-list__content">
            <h2 className="users-list__title">
              <Link to={`/users/${item.login}`} className="link">
                {item.login}
              </Link>
              {', '}
              {loadingRepos ? (
                <div className="loading-view"></div>
              ) : (
                item.repos != null &&
                item.repos + ' ' + numberDeclination(item.repos, ['репозиторий', 'репозитория', 'репозиториев'])
              )}
            </h2>
            {item.company && <p className="users-list__text">{item.company}</p>}
          </div>
        </section>
      ))}
    </div>
  );
};
