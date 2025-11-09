// src/components/shared/Avatar.tsx
import { User } from 'lucide-react';

interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  className?: string;
}

export function Avatar({ name, size = 'md', src, className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg'
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  const initials = getInitials(name);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-blue-100 flex items-center justify-center font-medium text-blue-700 ${className}`}
    >
      {initials || <User size={size === 'sm' ? 16 : size === 'md' ? 20 : 32} />}
    </div>
  );
}