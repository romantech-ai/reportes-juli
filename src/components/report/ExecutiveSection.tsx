import { cn } from '@/lib/utils';
import {
  MapPin,
  Route,
  BarChart3,
  Shield,
  AlertTriangle,
  Lightbulb,
  FileText,
} from 'lucide-react';

export type SectionType =
  | 'foto_zona'
  | 'rutas'
  | 'volumenes'
  | 'calidad'
  | 'riesgos'
  | 'oportunidades'
  | 'cierre';

interface ExecutiveSectionProps {
  type: SectionType;
  title: string;
  content?: string | string[];
  className?: string;
  children?: React.ReactNode;
}

const config: Record<
  SectionType,
  {
    icon: React.ElementType;
    bgColor: string;
    iconBg: string;
    iconColor: string;
    bulletColor: string;
    label: string;
    borderColor: string;
  }
> = {
  foto_zona: {
    icon: MapPin,
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    bulletColor: 'bg-blue-600',
    borderColor: 'border-blue-200',
    label: 'Visión General',
  },
  rutas: {
    icon: Route,
    bgColor: 'bg-slate-50',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-700',
    bulletColor: 'bg-slate-600',
    borderColor: 'border-slate-200',
    label: 'Logística',
  },
  volumenes: {
    icon: BarChart3,
    bgColor: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    bulletColor: 'bg-amber-600',
    borderColor: 'border-amber-200',
    label: 'Contratos',
  },
  calidad: {
    icon: Shield,
    bgColor: 'bg-cyan-50',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
    bulletColor: 'bg-cyan-600',
    borderColor: 'border-cyan-200',
    label: 'Estándares',
  },
  riesgos: {
    icon: AlertTriangle,
    bgColor: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    bulletColor: 'bg-orange-500',
    borderColor: 'border-orange-200',
    label: 'Atención',
  },
  oportunidades: {
    icon: Lightbulb,
    bgColor: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
    bulletColor: 'bg-green-600',
    borderColor: 'border-green-200',
    label: 'Propuestas',
  },
  cierre: {
    icon: FileText,
    bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    iconBg: 'bg-amber-200',
    iconColor: 'text-amber-800',
    bulletColor: 'bg-amber-700',
    borderColor: 'border-amber-300',
    label: 'Resumen',
  },
};

export function ExecutiveSection({
  type,
  title,
  content,
  className,
  children,
}: ExecutiveSectionProps) {
  const c = config[type];
  const Icon = c.icon;
  const isArray = Array.isArray(content);
  const items = isArray ? content : [];
  const hasContent = isArray
    ? content.length > 0
    : typeof content === 'string'
      ? !!content
      : !!children;

  if (!hasContent) return null;

  return (
    <div
      className={cn(
        'rounded-xl p-4 transition-all hover:shadow-sm border',
        c.bgColor,
        c.borderColor,
        className
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg',
            c.iconBg
          )}
        >
          <Icon className={cn('h-4 w-4', c.iconColor)} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-semibold text-stone-900">
              {title}
            </h4>
            {isArray && content.length > 0 && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  c.iconBg,
                  c.iconColor
                )}
              >
                {content.length}
              </span>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">
            {c.label}
          </p>
        </div>
      </div>

      {children ? (
        <div className="ml-1">{children}</div>
      ) : isArray ? (
        <ul className="space-y-2.5 ml-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 group">
              <span
                className={cn(
                  'mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0',
                  c.bulletColor
                )}
              />
              <span className="text-sm text-stone-700 leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone-700 leading-relaxed ml-1">{content}</p>
      )}
    </div>
  );
}
