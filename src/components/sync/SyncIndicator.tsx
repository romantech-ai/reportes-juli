import { useState } from 'react';
import { Cloud, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useReportStore } from '@/stores/reportStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { SyncStatus } from '@/services/syncService';

const statusConfig: Record<SyncStatus, {
  icon: typeof Cloud;
  color: string;
  bgColor: string;
  label: string;
}> = {
  synced: {
    icon: Cloud,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    label: 'Sincronizado',
  },
  syncing: {
    icon: RefreshCw,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    label: 'Sincronizando...',
  },
  offline: {
    icon: CloudOff,
    color: 'text-stone-400',
    bgColor: 'bg-stone-50',
    label: 'Sin conexión',
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    label: 'Error de sync',
  },
};

export function SyncIndicator() {
  const { syncStatus, lastSyncAt } = useReportStore();
  const [showTooltip, setShowTooltip] = useState(false);

  // Don't show if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return null;
  }

  const config = statusConfig[syncStatus];
  const Icon = config.icon;

  const formatLastSync = () => {
    if (!lastSyncAt) return 'Nunca';

    const date = new Date(lastSyncAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors',
          config.bgColor
        )}
      >
        <Icon
          className={cn(
            'h-4 w-4',
            config.color,
            syncStatus === 'syncing' && 'animate-spin'
          )}
        />
        <span className={cn('text-xs font-medium hidden sm:inline', config.color)}>
          {config.label}
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 p-3 z-50">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={cn('h-4 w-4', config.color)} />
            <span className="text-sm font-medium text-stone-900">
              {config.label}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Última sincronización: {formatLastSync()}
          </p>
        </div>
      )}
    </div>
  );
}
