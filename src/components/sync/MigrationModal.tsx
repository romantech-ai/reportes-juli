import { useState } from 'react';
import { Cloud, CheckCircle, Loader2, FileText } from 'lucide-react';
import { useReportStore } from '@/stores/reportStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface MigrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MigrationModal({ open, onOpenChange }: MigrationModalProps) {
  const { getLocalOnlyReportsCount, migrateLocalData } = useReportStore();
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isComplete, setIsComplete] = useState(false);

  const localCount = getLocalOnlyReportsCount();

  const handleMigrate = async () => {
    setIsMigrating(true);
    setProgress({ current: 0, total: localCount });

    await migrateLocalData((current, total) => {
      setProgress({ current, total });
    });

    setIsMigrating(false);
    setIsComplete(true);
  };

  const handleClose = () => {
    if (isMigrating) return;
    onOpenChange(false);
    // Reset state after closing
    setTimeout(() => {
      setIsComplete(false);
      setProgress({ current: 0, total: 0 });
    }, 200);
  };

  const percentComplete = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onClose={isMigrating ? undefined : handleClose}>
        {isComplete ? (
          <>
            <DialogHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle className="text-center">
                ¡Migración completada!
              </DialogTitle>
              <DialogDescription className="text-center">
                Tus {localCount} reporte{localCount !== 1 ? 's' : ''} han sido
                sincronizado{localCount !== 1 ? 's' : ''} con la nube.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button onClick={handleClose} className="bg-amber-600 hover:bg-amber-700">
                Continuar
              </Button>
            </DialogFooter>
          </>
        ) : isMigrating ? (
          <>
            <DialogHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Loader2 className="h-6 w-6 text-amber-600 animate-spin" />
              </div>
              <DialogTitle className="text-center">
                Migrando reportes...
              </DialogTitle>
              <DialogDescription className="text-center">
                {progress.current} de {progress.total} reportes
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Progress value={percentComplete} className="h-2" />
              <p className="text-center text-sm text-stone-500 mt-2">
                {percentComplete}% completado
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-amber-600" />
              </div>
              <DialogTitle className="text-center">
                Reportes locales detectados
              </DialogTitle>
              <DialogDescription className="text-center">
                Tienes{' '}
                <span className="font-semibold text-stone-700">
                  {localCount} reporte{localCount !== 1 ? 's' : ''}
                </span>{' '}
                guardado{localCount !== 1 ? 's' : ''} solo en este dispositivo.
                ¿Deseas sincronizarlos con la nube?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <FileText className="h-5 w-5 text-stone-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-stone-900">
                    {localCount} reporte{localCount !== 1 ? 's' : ''} pendiente{localCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-stone-500">
                    Se guardarán de forma segura en tu cuenta
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleClose}>
                Más tarde
              </Button>
              <Button onClick={handleMigrate} className="bg-amber-600 hover:bg-amber-700">
                <Cloud className="h-4 w-4 mr-2" />
                Migrar a la nube
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
