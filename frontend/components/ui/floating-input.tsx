'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    return (
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'peer w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900',
            'transition-all duration-200',
            'placeholder-transparent',
            'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
            'dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          {...props}
        />
        <label
          className={cn(
            'absolute left-4 top-3.5 text-slate-600 dark:text-slate-400',
            'transition-all duration-200 pointer-events-none',
            'peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base',
            'peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400',
            (isFocused || hasValue || props.value) && 'top-1 text-xs text-indigo-600 dark:text-indigo-400',
            error && 'peer-focus:text-red-600'
          )}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

interface FloatingTextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  rows?: number;
}

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, error, className, rows = 4, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    return (
      <div className="relative">
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'peer w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900',
            'transition-all duration-200',
            'placeholder-transparent resize-none',
            'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
            'dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-400',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          {...props}
        />
        <label
          className={cn(
            'absolute left-4 top-3.5 text-slate-600 dark:text-slate-400',
            'transition-all duration-200 pointer-events-none',
            'peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base',
            'peer-focus:top-1 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400',
            (isFocused || hasValue || props.value) && 'top-1 text-xs text-indigo-600 dark:text-indigo-400',
            error && 'peer-focus:text-red-600'
          )}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

FloatingTextarea.displayName = 'FloatingTextarea';
