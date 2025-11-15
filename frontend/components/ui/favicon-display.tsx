'use client';

import { useState } from 'react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface FaviconDisplayProps {
  url: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
}

export function FaviconDisplay({ url, className, size = 'md', fallback = '🌐' }: FaviconDisplayProps) {
  const [hasError, setHasError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const sizeValues = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  let domain = '';
  let faviconUrl = '';
  
  try {
    domain = new URL(url).hostname;
    faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded font-semibold',
          sizeClasses[size],
          className
        )}
      >
        {fallback}
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded font-semibold',
          sizeClasses[size],
          className
        )}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div className={cn('shrink-0 flex items-center justify-center', className)}>
      <Image
        src={faviconUrl}
        alt={`${domain} favicon`}
        width={sizeValues[size]}
        height={sizeValues[size]}
        className={cn('rounded object-contain', sizeClasses[size])}
        onError={() => setHasError(true)}
        unoptimized
      />
    </div>
  );
}
