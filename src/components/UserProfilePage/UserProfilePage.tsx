import React, { Dispatch, FC, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfilePage.css';
import { RepoAPI, UserFullAPI } from '../../types';
import { numberUnit, numberFormat } from '../../utils';

interface Props {
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export const UserProfilePage: FC<Props> = ({ setSearchValue }) => {
  // Get login
  const { login }: { login?: string } = useParams();

  const [user, setUser] = React.useState<UserFullAPI | null>(null);
  const [repos, setRepos] = React.useState<RepoAPI[] | null>(null);
  const [loadingRepos, setLoadingRepos] = React.useState<boolean>(true);
  const [errorRepos, setErrorRepos] = React.useState<string>('');

  React.useEffect(() => {
    // Clean search field
    setSearchValue('');

    setLoadingRepos(true);

    // Fetch user info
    fetch(`https://api.github.com/users/${login}`, {
      headers: new Headers({
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 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',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });

    // Fetch user repos info
    fetch(`https://api.github.com/users/${login}/repos`, {
      headers: new Headers({
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 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',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message || data.length === 0) {
          setErrorRepos('Репозитории не найдены');
        }
        setRepos(data);
        setLoadingRepos(false);
      })
      .catch(() => {
        setErrorRepos('Ошибка, попробуйте еще раз');
        setLoadingRepos(false);
      });
  }, [login]);

  // Not render if user is empty
  if (user === null) {
    return null;
  }

  return (
    <main>
      <div className="container">
        <section className="user-profile">
          <div className="user-profile__image-container">
            <img className="user-profile__image" src={user.avatar_url} alt={user.login + ' profile photo'} />
          </div>
          <div className="user-profile__content">
            <h1 className="user-profile__title">
              {user.name && user.name + ', '}
              <span className="user-profile__accent">{user.login}</span>
            </h1>
            <p className="user-profile__text">
              <span className="user-profile__accent">{numberFormat(user.followers, 1)}</span>{' '}
              {numberUnit(user.followers, ['подписчик', 'подписчика', 'подписчиков'])}
              {` · `}
              <span className="user-profile__accent">{numberFormat(user.following, 1)}</span>{' '}
              {numberUnit(user.following, ['подписка', 'подписки', 'подписок'])}
              {user.blog && (
                <>
                  {` · `}
                  <a href={user.blog} target="_blank" rel="noreferrer" className="link">
                    {user.blog}
                  </a>
                </>
              )}
            </p>
          </div>
        </section>

        <section className="repository-list">
          {!loadingRepos ? (
            <>
              <div className="repository-list__header">
                <h2 className="repository-list__title">Репозитории</h2>
                {repos && repos.length > 0 && (
                  <a
                    href={`https://github.com/${login}?tab=repositories`}
                    className="link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Все репозитории
                  </a>
                )}
              </div>

              <div className="repository-list__container">
                {!errorRepos ? (
                  repos &&
                  repos.map((item) => (
                    <section className="repository-list__item" key={item.id}>
                      <h3 className="repository-list__item-title">
                        <a href={item.html_url} target="_blank" rel="noreferrer" className="link">
                          {item.name}
                        </a>
                      </h3>
                      <p className="repository-list__item-text">{item.description}</p>
                    </section>
                  ))
                ) : (
                  <h3 className="repository-list__item-title">{errorRepos}</h3>
                )}
              </div>
            </>
          ) : (
            <div className="repository-list__header">
              <h2 className="repository-list__title">Загрузка репозиториев...</h2>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
