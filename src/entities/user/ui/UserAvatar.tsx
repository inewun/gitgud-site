import Image from 'next/image';
import React, { memo } from 'react';

import { borders } from '@/styles/compositions';

interface UserAvatarProps {
  avatar?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, name, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  const sizePx = {
    sm: 32,
    md: 40,
    lg: 64,
  };

  const initials = name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${
        avatar ? '' : 'bg-blue-100 text-blue-800'
      } ${className || ''}`}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={sizePx[size]}
          height={sizePx[size]}
          className={`${borders.roundedFull} object-cover`}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default memo(UserAvatar);
