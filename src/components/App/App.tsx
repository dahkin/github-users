import React, { FC, useEffect, useState } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { UserProfilePage } from '../UserProfilePage/UserProfilePage';
import { UsersPage } from '../UsersPage/UsersPage';
import { UsersSearchPage } from '../UsersSearchPage/UsersSearchPage';
import { Header } from '../Header/Header';
import { OfflineNotificationWatcher } from '@features/networkStatus/OfflineNotificationWatcher/OfflineNotificationWatcher';

export const App: FC = () => {
  // Get location path
  const { pathname } = useLocation();

  // Keep it at the App level, to clean on pages load
  const [searchValue, setSearchValue] = useState('');

  // Scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <OfflineNotificationWatcher />
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <Switch>
        <Route path="/users/:login">
          <UserProfilePage setSearchValue={setSearchValue} />
        </Route>
        <Route path="/search">
          <UsersSearchPage />
        </Route>
        <Route path="/">
          <UsersPage setSearchValue={setSearchValue} />
        </Route>
      </Switch>
    </>
  );
};
