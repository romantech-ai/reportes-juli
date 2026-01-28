import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Lightbulb, Compass } from 'lucide-react';

type SectionType = 'situacion' | 'problemas' | 'soluciones' | 'oportunidades';

interface DiagnosticSectionProps {
  type: SectionType;
  title: string;
  content: string | string[];
  className?: string;
}

const config: Record<SectionType, {
  icon: React.ElementType;
  css: string;
  iconBg: string;
  iconColor: string;
  bulletColor: string;
  label: string;
}> = {
  situacion: {
    icon: Compass,
    css: 'diagnostic-situacion',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-700',
    bulletColor: 'bg-slate-600',
    label: 'Contexto',
  },
  problemas: {
    icon: AlertTriangle,
    css: 'diagnostic-problemas',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    bulletColor: 'bg-orange-500',
    label: 'Atención',
  },
  soluciones: {
    icon: CheckCircle,
    css: 'diagnostic-soluciones',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
    bulletColor: 'bg-green-600',
    label: 'Acción',
  },
  oportunidades: {
    icon: Lightbulb,
    css: 'diagnostic-oportunidades',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-700',
    bulletColor: 'bg-yellow-600',
    label: 'Potencial',
  },
};

export function DiagnosticSection({ type, title, content, className }: DiagnosticSectionProps) {
  const c = config[type];
  const Icon = c.icon;
  const isArray = Array.isArray(content);
  const items = isArray ? content : [content];
  const hasContent = isArray ? content.length > 0 : !!content;

  if (!hasContent) return null;

  return (
    <div className={cn('rounded-xl p-4 transition-all hover:shadow-sm', c.css, className)}>
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('flex items-center justify-center w-9 h-9 rounded-lg', c.iconBg)}>
          <Icon className={cn('h-4 w-4', c.iconColor)} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-semibold text-stone-900">{title}</h4>
            {isArray && content.length > 0 && (
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', c.iconBg, c.iconColor)}>
                {content.length}
              </span>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">{c.label}</p>
        </div>
      </div>

      {isArray ? (
        <ul className="space-y-2.5 ml-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 group">
              <span className={cn('mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0', c.bulletColor)} />
              <span className="text-sm text-stone-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone-700 leading-relaxed ml-1">{content}</p>
      )}
    </div>
  );
}
