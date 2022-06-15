import React, { ForwardedRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import './LocaleSwitcherButton.css';
import { Locale } from '@features/locale/types';
import { ChevronDown } from '@components/Icons/ChevronDown';

interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => any;
  locale: Locale;
  opened?: boolean;
}

export const LocaleSwitcherButton = forwardRef(function LocaleSwitcherButton(
  { onClick, locale, opened }: Props,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const { t } = useTranslation();
  return (
    <button
      className={classNames('locale-switcher-button', { 'locale-switcher-button--opened': opened })}
      ref={ref}
      onClick={onClick}
      aria-label={t('locale_switcher')}
      aria-haspopup="listbox"
      aria-expanded={opened}
      aria-controls={opened ? 'locale-switcher' : undefined}
    >
      <span className="locale-switcher-button__text">
        {locale === 'en' && 'ENG'}
        {locale === 'ru' && 'RU'}
      </span>
      <span className="locale-switcher-button__icon" aria-hidden={true}>
        <ChevronDown />
      </span>
    </button>
  );
});
