import { NavLink } from 'react-router-dom';
import { Home, FileText, BarChart3, X, Milk } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/reportes', icon: FileText, label: 'Reportes' },
  { to: '/resumen', icon: BarChart3, label: 'Resumen' },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}

      <aside className={cn(
        'fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-stone-200 transform transition-transform duration-300 flex flex-col',
        'md:static md:transform-none',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-stone-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-sm">
              <Milk className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-stone-900">Reportes Juli</h1>
              <p className="text-xs text-stone-500">Compras de leche</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-stone-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                  isActive
                    ? 'bg-amber-100 text-amber-800 shadow-sm'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-5 w-5', isActive && 'text-amber-600')} strokeWidth={isActive ? 2 : 1.5} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-stone-100 flex-shrink-0">
          <p className="text-xs text-stone-400 text-center">Julian - Dir. Compras</p>
        </div>
      </aside>
    </>
  );
}
