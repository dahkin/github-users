import React, { FC, FormEvent, Dispatch, SetStateAction } from 'react';
import { NavLink, Route, Switch, RouteComponentProps, useHistory } from 'react-router-dom';
import './Header.css';

interface MatchParams {
  login: string;
}

interface Props {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export const Header: FC<Props> = ({ searchValue, setSearchValue }) => {
  const history = useHistory();
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
              <NavLink to="/" className="header__navigation-link">
                Пользователи гитхаба
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
                  <a className="header__navigation-link header__navigation-link--user">Поиск</a>
                </li>
              </Route>
            </Switch>
          </ul>
        </nav>

        <div className="header__search">
          <form className="header__search-form" onSubmit={onSubmit}>
            <input
              type="search"
              className="header__search-input"
              placeholder="Поиск пользователя"
              value={searchValue}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
            />
            <button type="submit" className="header__search-button">
              Найти
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};
