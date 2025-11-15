import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
      icon: '⏳',
    },
    processing: {
      label: 'Processing',
      className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      icon: '⚡',
    },
    completed: {
      label: 'Completed',
      className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
      icon: '✓',
    },
    failed: {
      label: 'Failed',
      className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      icon: '✕',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border transition-all duration-200',
        config.className,
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      <span className="text-base leading-none">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
