import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Report, ReportDraft } from '@/types/report';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface SupabaseReport {
  id: string;
  created_at: string;
  updated_at: string;
  data: ReportDraft;
}

// Convert Supabase report to local Report format
function toLocalReport(remote: SupabaseReport): Report {
  return {
    ...remote.data,
    id: remote.data.transcripcion_original
      ? `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      : remote.id,
    remote_id: remote.id,
    createdAt: remote.created_at,
    updatedAt: remote.updated_at,
  };
}

// Convert local Report to Supabase format
function toRemoteData(report: Report): ReportDraft {
  const { id, createdAt, updatedAt, remote_id, ...data } = report;
  return data as ReportDraft;
}

// Fetch all reports from Supabase
export async function fetchReports(): Promise<Report[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }

  return (data as SupabaseReport[]).map(toLocalReport);
}

// Save or update a report in Supabase
export async function saveReport(report: Report): Promise<Report> {
  if (!isSupabaseConfigured() || !supabase) {
    return report;
  }

  const remoteData = toRemoteData(report);

  if (report.remote_id) {
    // Update existing report
    const { data, error } = await supabase
      .from('reports')
      .update({
        data: remoteData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', report.remote_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating report:', error);
      throw error;
    }

    return toLocalReport(data as SupabaseReport);
  } else {
    // Insert new report
    const { data, error } = await supabase
      .from('reports')
      .insert({
        data: remoteData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating report:', error);
      throw error;
    }

    return toLocalReport(data as SupabaseReport);
  }
}

// Delete a report from Supabase
export async function deleteReportRemote(remoteId: string): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) {
    return;
  }

  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', remoteId);

  if (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
}

// Subscribe to realtime changes
export function subscribeToChanges(
  onInsert: (report: Report) => void,
  onUpdate: (report: Report) => void,
  onDelete: (remoteId: string) => void
): RealtimeChannel | null {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  const channel = supabase
    .channel('reports-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'reports',
      },
      (payload) => {
        const report = toLocalReport(payload.new as SupabaseReport);
        onInsert(report);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'reports',
      },
      (payload) => {
        const report = toLocalReport(payload.new as SupabaseReport);
        onUpdate(report);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'reports',
      },
      (payload) => {
        const remoteId = (payload.old as { id: string }).id;
        onDelete(remoteId);
      }
    )
    .subscribe();

  return channel;
}

// Unsubscribe from realtime changes
export function unsubscribeFromChanges(channel: RealtimeChannel | null): void {
  if (channel && supabase) {
    supabase.removeChannel(channel);
  }
}

// Migrate local reports to Supabase
export async function migrateLocalReports(
  localReports: Report[],
  onProgress?: (current: number, total: number) => void
): Promise<Report[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return localReports;
  }

  const migratedReports: Report[] = [];
  const reportsToMigrate = localReports.filter(r => !r.remote_id);

  for (let i = 0; i < reportsToMigrate.length; i++) {
    const report = reportsToMigrate[i];
    try {
      const migrated = await saveReport(report);
      migratedReports.push(migrated);
      onProgress?.(i + 1, reportsToMigrate.length);
    } catch (error) {
      console.error('Error migrating report:', error);
      // Keep the local version if migration fails
      migratedReports.push(report);
    }
  }

  // Include reports that were already migrated
  const alreadyMigrated = localReports.filter(r => r.remote_id);
  return [...migratedReports, ...alreadyMigrated];
}
