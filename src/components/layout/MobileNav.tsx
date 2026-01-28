import { NavLink } from 'react-router-dom';
import { Home, FileText, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/reportes', icon: FileText, label: 'Reportes' },
  { to: '/resumen', icon: BarChart3, label: 'Resumen' },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-lg border-t border-stone-200" />
      <div className="relative flex items-center justify-around h-16 px-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-xl transition-all',
                isActive ? 'text-amber-700' : 'text-stone-500 hover:text-stone-700'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn('p-1.5 rounded-lg transition-colors', isActive && 'bg-amber-100')}>
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
                </div>
                <span className={cn('text-[10px] font-medium tracking-wide', isActive && 'font-semibold')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
