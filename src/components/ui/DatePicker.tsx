import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function DatePicker({ value, onChange, label, className }: DatePickerProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-stone-600 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-amber-600" />
          {label}
        </label>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-700
                   focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                   transition-all cursor-pointer hover:border-amber-400"
      />
    </div>
  );
}
