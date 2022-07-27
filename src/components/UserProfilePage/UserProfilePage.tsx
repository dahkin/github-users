import React, { Dispatch, FC, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './UserProfilePage.css';
import { RepoAPI, UserFullAPI } from '../../types';
import { numberFormat, repeat } from '../../utils';
import { Image } from '@components/Image/Image';
import { SkeletonText } from '@components/SkeletonText/SkeletonText';

interface Props {
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export const UserProfilePage: FC<Props> = ({ setSearchValue }) => {
  // Get login
  const { login }: { login?: string } = useParams();

  const { t } = useTranslation();

  const [user, setUser] = React.useState<UserFullAPI | null>(null);
  const [repos, setRepos] = React.useState<RepoAPI[] | null>(null);
  const [loadingRepos, setLoadingRepos] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [errorRepos, setErrorRepos] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    // Clean search field
    setSearchValue('');

    setLoading(true);
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
        if (data.message || data.length === 0) {
          setError('no_user_message');
        }
        setUser(data);
        setLoading(false);
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
          setErrorRepos('repositories_empty_message');
        }
        setRepos(data);
        setLoadingRepos(false);
      });
  }, [login]);

  const MainInfoSkeleton = () => (
    <section className="user-profile" aria-labelledby="user-name">
      <div className="user-profile__image-container">
        <Image className="user-profile__image" skeleton />
      </div>
      <div className="user-profile__content">
        <h1 id="user-name" className="user-profile__title" aria-live="polite">
          <span className="user-profile__accent">{login}</span>
        </h1>
        <p className="user-profile__text">
          <SkeletonText />
        </p>
      </div>
    </section>
  );

  const ReposListSkeleton = () => (
    <>
      <div className="repository-list__header">
        <h2 className="repository-list__title">{t('repositories_title')}</h2>
      </div>
      <div className="repository-list__container">
        {repeat(
          (i) => (
            <article className="repository-list__item" key={i}>
              <h3 className="repository-list__item-title">
                <SkeletonText accent />
              </h3>
              <p className="repository-list__item-text">
                <SkeletonText rowsCount={2} />
              </p>
            </article>
          ),
          4
        )}
      </div>
    </>
  );

  // Not render if error
  if (error) {
    return (
      <main>
        <div className="container">
          <h3 className="user-profile__title">{t(error)}</h3>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        {loading ? (
          <MainInfoSkeleton />
        ) : (
          user && (
            <section className="user-profile" aria-labelledby="user-name">
              <div className="user-profile__image-container">
                <Image
                  className="user-profile__image"
                  src={user.avatar_url}
                  alt={t('profile_photo', { name: user.login })}
                />
              </div>
              <div className="user-profile__content">
                <h1 id="user-name" className="user-profile__title" aria-live="polite">
                  {user.name && user.name + ', '}
                  <span className="user-profile__accent">{user.login}</span>
                </h1>
                <p className="user-profile__text">
                  <span className="user-profile__accent">{numberFormat(user.followers, 1)}</span>{' '}
                  {user.followers < 1000
                    ? t('followers_number', { count: user.followers })
                    : t('followers_number_other')}
                  {` · `}
                  <span className="user-profile__accent">{numberFormat(user.following, 1)}</span>{' '}
                  {user.following < 1000
                    ? t('following_number', { count: user.following })
                    : t('following_number_other')}
                  {user.blog && (
                    <>
                      {` · `}
                      <a
                        href={user.blog}
                        aria-label={t('blog_link', { name: user.name })}
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                      >
                        {user.blog}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </section>
          )
        )}
        <section className="repository-list" aria-busy={loadingRepos} aria-labelledby="repositories-title">
          {loadingRepos ? (
            <ReposListSkeleton />
          ) : (
            user && (
              <>
                <div className="repository-list__header">
                  <h2 id="repositories-title" className="repository-list__title">
                    {t('repositories_title')}
                  </h2>
                  {repos && repos.length > 0 && (
                    <a
                      href={`https://github.com/${login}?tab=repositories`}
                      className="link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('repositories_link')}
                    </a>
                  )}
                </div>

                <div className="repository-list__container">
                  {!errorRepos ? (
                    repos &&
                    repos.map((item, index) => (
                      <article className="repository-list__item" key={item.id}>
                        <h3 className="repository-list__item-title" aria-describedby={`${user.login}-repo-${index}`}>
                          <a href={item.html_url} target="_blank" rel="noreferrer" className="link">
                            {item.name}
                          </a>
                        </h3>
                        <p id={`${user.login}-repo-${index}`} className="repository-list__item-text">
                          {item.description}
                        </p>
                      </article>
                    ))
                  ) : (
                    <h3 className="repository-list__item-title">{t(errorRepos)}</h3>
                  )}
                </div>
              </>
            )
          )}
        </section>
      </div>
    </main>
  );
};
