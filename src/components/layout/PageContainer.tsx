import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn('flex-1 pb-20 md:pb-6', className)}>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-4 md:py-6">{children}</div>
    </main>
  );
}
