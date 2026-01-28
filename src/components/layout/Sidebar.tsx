import { NavLink } from 'react-router-dom';
import { Home, FileText, BarChart3, X, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/reportes', icon: FileText, label: 'Reportes' },
  { to: '/resumen', icon: BarChart3, label: 'Resumen Semanal' },
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
        'fixed left-0 top-0 z-50 h-full w-72 bg-white border-r border-stone-200 transform transition-transform duration-300',
        'md:static md:transform-none',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-display text-base font-semibold text-stone-900">Field Journal</h1>
              <p className="text-[10px] text-stone-500 uppercase tracking-wide">Comercial</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-stone-600" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                  isActive ? 'bg-amber-100 text-amber-700' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-sm">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-200">
          <div className="px-4 py-3 bg-stone-100 rounded-xl">
            <p className="text-xs text-stone-500 text-center">Formación comercial</p>
            <p className="text-xs text-amber-700 text-center font-medium mt-0.5">21 días de aprendizaje</p>
          </div>
        </div>
      </aside>
    </>
  );
}
