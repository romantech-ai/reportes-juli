import { cn } from '@/lib/utils';

interface WaveformIndicatorProps {
  isActive: boolean;
  className?: string;
}

export function WaveformIndicator({ isActive, className }: WaveformIndicatorProps) {
  const heights = [16, 24, 32, 40, 32, 24, 16];

  return (
    <div className={cn('flex items-end justify-center gap-1 h-10', className)}>
      {heights.map((h, i) => (
        <div
          key={i}
          className={cn(
            'w-1 rounded-full transition-all',
            isActive
              ? 'bg-gradient-to-t from-orange-500 to-orange-400 sound-wave-bar'
              : 'bg-stone-200 h-1'
          )}
          style={{
            '--wave-height': `${h}px`,
            animationDelay: isActive ? `${i * 0.1}s` : '0s',
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
