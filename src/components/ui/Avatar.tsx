import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ name, imageUrl, size = 28, className = '' }: AvatarProps) {
  const initials = name ? name.substring(0, 2).toUpperCase() : '??';

  return (
    <div
      className={`${styles.avatar} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className={styles.image} />
      ) : (
        initials
      )}
    </div>
  );
}

interface AvatarStackProps {
  users: Array<{ fullName: string; profileImageUrl?: string | null }>;
  totalCount: number;
  maxDisplay?: number;
  size?: number;
}

export function AvatarStack({ users, totalCount, maxDisplay = 3, size = 28 }: AvatarStackProps) {
  const displayUsers = users.slice(0, maxDisplay);
  const remainingCount = totalCount - displayUsers.length;

  return (
    <div className={styles.stack}>
      {displayUsers.map((user, i) => (
        <div key={i} className={styles.stackItem} style={{ zIndex: maxDisplay - i }}>
          <Avatar name={user.fullName} imageUrl={user.profileImageUrl} size={size} />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`${styles.avatar} ${styles.stackItem} ${styles.stackMore}`}
          style={{ width: size, height: size, fontSize: size * 0.4, zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
