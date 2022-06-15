import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import './OfflineNotification.css';

export const OfflineNotification: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="offline-notification" role="status">
      {t('offline_notification_text')}
    </div>
  );
};
