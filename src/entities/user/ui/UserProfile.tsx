import Image from 'next/image';
import React from 'react';

import { withMemo } from '@/shared/lib/utils/memo';
import { layout, typography, borders } from '@/styles/compositions';

import { User } from '../model/types';

interface UserProfileProps {
  user: User;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, className }) => {
  return (
    <div className={className}>
      <div className={layout.flexStart}>
        {user.avatar && (
          <Image
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            width={64}
            height={64}
            className={borders.roundedFull}
          />
        )}
        <div>
          <h3 className={typography.heading4}>
            {user.firstName} {user.lastName}
          </h3>
          <p className={typography.caption}>{user.email}</p>
          <div className="mt-1">
            {user.roles.map(role => (
              <span
                key={role.id}
                className={`inline-block px-2 py-1 mr-1 text-xs ${borders.rounded} bg-subtle text-muted-foreground`}
              >
                {role.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withMemo(UserProfile);
