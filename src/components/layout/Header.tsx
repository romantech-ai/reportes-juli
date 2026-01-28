import { Menu, BookOpen } from 'lucide-react';
import { getTrainingDay } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const day = getTrainingDay();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-neutral-100 rounded-lg">
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-neutral-900 hidden sm:block">Field Journal</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
          Día {day}/21
        </div>
      </div>
    </header>
  );
}
