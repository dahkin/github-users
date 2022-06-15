import React, { FC } from 'react';
import classNames from 'classnames';
import './LocaleSwitcherMenu.css';
import { Locale } from '@features/locale/types';

interface Props {
  selectedLocale: Locale;
  onChangeLocale: (value: Locale) => any;
  className?: string;
}

export const LocaleSwitcherMenu: FC<Props> = ({ selectedLocale, onChangeLocale, className }) => {
  return (
    <div id="locale-switcher" className={classNames('locale-switcher-menu', className)} role="listbox">
      <button
        role="option"
        className={classNames(
          'locale-switcher-menu__option',
          selectedLocale === Locale.ru && 'locale-switcher-menu__option--selected'
        )}
        aria-selected={selectedLocale === Locale.ru}
        onClick={() => onChangeLocale(Locale.ru)}
      >
        <span className="locale-switcher-menu__text">Русский</span>
      </button>
      <button
        role="option"
        className={classNames(
          'locale-switcher-menu__option',
          selectedLocale === Locale.en && 'locale-switcher-menu__option--selected'
        )}
        aria-selected={selectedLocale === Locale.en}
        onClick={() => onChangeLocale(Locale.en)}
      >
        <span className="locale-switcher-menu__text">English</span>
      </button>
    </div>
  );
};
