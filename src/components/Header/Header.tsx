import React, { FC, FormEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Route, Switch, RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import { LocaleSwitcherDesktop } from '@features/locale/components/LocaleSwitcherDesktop/LocaleSwitcherDesktop';
import './Header.css';
import { LocationState } from '../../types';

interface MatchParams {
  login: string;
}

interface Props {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export const Header: FC<Props> = ({ searchValue, setSearchValue }) => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { t } = useTranslation();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchValue.trim().length) {
      return;
    }
    history.push(`/search?query=${searchValue}`);
  };

  return (
    <header className="header">
      <div className="container header__container">
        <nav className="header__navigation">
          <ul className="header__navigation-list">
            <li className="header__navigation-list-item">
              <NavLink
                to="/"
                aria-current={location.pathname === '/' ? 'page' : undefined}
                className="header__navigation-link"
              >
                {t('header_title')}
              </NavLink>
            </li>
            <Switch>
              <Route
                path="/users/:login"
                render={(props: RouteComponentProps<MatchParams>) => (
                  <li className="header__navigation-list-item">
                    <a className="header__navigation-link header__navigation-link--user">{props.match.params.login}</a>
                  </li>
                )}
              />
              <Route path="/search">
                <li className="header__navigation-list-item">
                  <a className="header__navigation-link header__navigation-link--user">{t('header_search_title')}</a>
                </li>
              </Route>
            </Switch>
          </ul>
        </nav>
        <div className="header__controls">
          <LocaleSwitcherDesktop />
          <div className="header__search">
            <form className="header__search-form" role="search" onSubmit={onSubmit}>
              <input
                type="search"
                className="header__search-input"
                placeholder={t('search_placeholder')}
                value={searchValue}
                onChange={(event) => setSearchValue(event.currentTarget.value)}
              />
              <button type="submit" className="header__search-button">
                {t('search_button')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};
