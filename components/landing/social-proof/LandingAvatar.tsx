import clsx from 'clsx';
import Image from '@/components/shared/Image';

export interface SocialProofItem {
  imageSrc: string;
  name: string;
}

interface LandingAvatarProps extends SocialProofItem {
  className?: string;
  width?: number;
  height?: number;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

/**
 * Shows an avatar image or a placeholder if no image is provided.
 */
export const LandingAvatar = ({
  className,
  imageSrc,
  name,
  width = 128,
  height = 128,
  size = 'medium',
}: LandingAvatarProps) => {
  const sizeClasses = clsx(
    size === 'small' && 'w-6 h-6',
    size === 'medium' && 'h-9 w-9',
    size === 'large' && 'h-12 w-12',
    size === 'xlarge' && 'h-16 w-16',
  );

  const baseClasses = clsx(
    'rounded-full border-2 border-solid border-primary-100',
    sizeClasses,
    className,
  );

  if (!imageSrc) {
    const initials = name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div
        className={clsx(
          baseClasses,
          'flex items-center justify-center bg-primary-200 text-primary-700 font-medium',
          size === 'small' && 'text-[8px]',
          size === 'medium' && 'text-xs',
          size === 'large' && 'text-sm',
          size === 'xlarge' && 'text-base',
        )}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={name}
      width={width}
      height={height}
      className={baseClasses}
    />
  );
};
