import { useState } from 'react';
import { Plus, X, Pencil, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableListProps {
  items: string[];
  onSave: (items: string[]) => void;
  placeholder?: string;
  bulletColor?: string;
  className?: string;
}

export function EditableList({
  items,
  onSave,
  placeholder = 'Nuevo item...',
  bulletColor = 'bg-stone-400',
  className,
}: EditableListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState('');

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      const newItems = [...items];
      newItems[editingIndex] = editValue.trim();
      onSave(newItems);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onSave(newItems);
  };

  const handleAdd = () => {
    if (newValue.trim()) {
      onSave([...items, newValue.trim()]);
      setNewValue('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: 'edit' | 'add') => {
    if (e.key === 'Enter') {
      if (action === 'edit') handleSaveEdit();
      else handleAdd();
    } else if (e.key === 'Escape') {
      if (action === 'edit') {
        setEditingIndex(null);
        setEditValue('');
      } else {
        setIsAdding(false);
        setNewValue('');
      }
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <div key={index} className="group flex items-start gap-2">
          <span className={cn('mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0', bulletColor)} />

          {editingIndex === index ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'edit')}
                className="flex-1 px-2 py-1 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                autoFocus
              />
              <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={() => setEditingIndex(null)} className="p-1 text-stone-400 hover:bg-stone-100 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <span className="flex-1 text-sm text-stone-700">{item}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(index)}
                  className="p-1 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-2 ml-3">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            placeholder={placeholder}
            className="flex-1 px-2 py-1 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            autoFocus
          />
          <button onClick={handleAdd} className="p-1 text-green-600 hover:bg-green-50 rounded">
            <Check className="h-4 w-4" />
          </button>
          <button onClick={() => { setIsAdding(false); setNewValue(''); }} className="p-1 text-stone-400 hover:bg-stone-100 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 ml-3 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2 py-1 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Añadir
        </button>
      )}
    </div>
  );
}
