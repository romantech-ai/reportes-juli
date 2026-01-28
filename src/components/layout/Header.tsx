import { Menu, Milk } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-stone-100 rounded-lg">
            <Menu className="w-5 h-5 text-stone-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center shadow-sm">
              <Milk className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-stone-900 hidden sm:block">Reportes Juli</span>
          </div>
        </div>
        <div className="text-sm text-stone-500">
          Compras de leche
        </div>
      </div>
    </header>
  );
}
