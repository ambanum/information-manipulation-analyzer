import { RiCake2Fill as IconCake, RiUserFill as IconUser } from 'react-icons/ri';

import Loading from 'components/Loading';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import s from './TwitterDataCard.module.scss';

dayjs.extend(relativeTime);

type TwitterDataCardProps = {
  image?: string;
  displayname?: string;
  username: string;
  nbFollowers?: number;
  verified?: boolean;
  created?: string;
  loading?: boolean;
  onUsernameClick: (value: string) => any;
} & React.HTMLAttributes<HTMLDivElement>;

// @ts-ignore
const humanize = Intl.NumberFormat('en', { notation: 'compact' }).format;

const TwitterDataCard: React.FC<TwitterDataCardProps> = React.memo(
  ({
    image,
    displayname,
    username,
    nbFollowers,
    className,
    created,
    onUsernameClick,
    verified,
    loading,
    ...props
  }) => {
    return (
      <div className={`${className || ''} ${s.card} ${loading ? s.loading : ''}`} {...props}>
        <div className={s.imageWrapper}>
          <div className={s.imageWrapper_default}>
            <IconUser aria-label="Created" color="#9C9C9C" />
          </div>
          {image && <img src={image} width="40" height="40" className={s.imageWrapper_img} />}
          {loading && <Loading size="sm" showMessage={false} className={s.imageWrapper_loading} />}
        </div>
        <div className={s.infosWrapper}>
          {displayname && (
            <div className={s.infosWrapper_name}>
              <a
                href={' '}
                rel="noreferrer noopener"
                title={`View ${displayname} on Twitter`}
                target="_blank"
                onClick={(e) => {
                  onUsernameClick(username);
                  e.preventDefault();
                }}
              >
                <span>{displayname}</span>
              </a>
            </div>
          )}

          <ul>
            {username && <li>{username}</li>}

            {created && (
              <li>
                <IconCake aria-label="Created" color="#9C9C9C" />
                {created && dayjs(created).fromNow(true)}
              </li>
            )}
            {nbFollowers && <li>{humanize(nbFollowers)} followers</li>}
          </ul>
        </div>
      </div>
    );
  }
);

export default TwitterDataCard;
