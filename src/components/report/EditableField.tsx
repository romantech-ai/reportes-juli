import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  label?: string;
  multiline?: boolean;
  className?: string;
}

export function EditableField({
  value,
  onSave,
  label,
  multiline = false,
  className,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <div className={cn('flex items-start gap-2', className)}>
        <InputComponent
          ref={inputRef as React.RefObject<HTMLInputElement & HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex-1 px-2 py-1 text-sm border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50',
            multiline && 'min-h-[80px] resize-y'
          )}
        />
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            className="p-1 text-success hover:bg-success/10 rounded"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-danger hover:bg-danger/10 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('group', className)}>
      {label && (
        <span className="text-xs text-muted uppercase tracking-wide">
          {label}
        </span>
      )}
      <div className="flex items-start gap-2">
        <span className="flex-1 text-sm text-foreground">
          {value || <span className="text-muted italic">Sin datos</span>}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 text-muted hover:text-primary hover:bg-primary/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
