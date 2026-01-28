import { cn, formatShortDate } from '@/lib/utils';

interface TimelineItemProps {
  date: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  isLast?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function TimelineItem({
  date,
  title,
  subtitle,
  badge,
  isLast = false,
  onClick,
  children,
}: TimelineItemProps) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />
        {!isLast && (
          <div className="w-0.5 flex-1 bg-border min-h-[40px]" />
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'flex-1 pb-6',
          onClick && 'cursor-pointer'
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted">
            {formatShortDate(date)}
          </span>
          {badge}
        </div>
        <h4 className="font-medium text-foreground">{title}</h4>
        {subtitle && (
          <p className="text-sm text-muted mt-0.5">{subtitle}</p>
        )}
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}
