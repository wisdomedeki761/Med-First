'use client';

import { useState, forwardRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HoverLift } from '@/components/ui/animations';

interface TextInputProps {
  onSend: (text: string, imageBase64?: string) => void;
  isLoading: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  inputRef?: React.Ref<HTMLTextAreaElement>;
}

export const TextInput = forwardRef<HTMLTextAreaElement, TextInputProps>(({
  onSend,
  isLoading,
  value: controlledValue,
  onChange,
  placeholder,
  inputRef: externalRef,
}, ref) => {
  const [internalValue, setInternalValue] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = onChange || setInternalValue;

  const handleSubmit = () => {
    if (!value.trim() && !imageBase64) return;
    onSend(value, imageBase64 || undefined);
    setValue('');
    setImageBase64(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      setImageBase64(base64Data);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-gray rounded-2xl p-2 border border-white/10 touch-manipulation">
      {imageBase64 && (
        <div className="relative mb-2">
          <img
            src={`data:image/jpeg;base64,${imageBase64}`}
            alt="Attached image"
            className="w-16 h-16 rounded-lg object-cover"
          />
          <button
            onClick={() => setImageBase64(null)}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-critical text-white flex items-center justify-center"
            aria-label="Remove attached image"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <label className="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white touch-manipulation">
          <Paperclip size={20} aria-hidden="true" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            aria-label="Attach image"
          />
        </label>

        <textarea
          ref={(node) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
            if (externalRef) {
              if (typeof externalRef === 'function') externalRef(node);
              else externalRef.current = node;
            }
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || (imageBase64 ? "Describe what you see (optional)" : "Describe your emergency...")}
          className={cn(
            'flex-1 bg-transparent text-white placeholder-white/40',
            'resize-none focus:outline-none',
            'min-h-[48px] max-h-32 py-2',
            'text-base sm:text-sm',
            'touch-manipulation'
          )}
          rows={1}
          disabled={isLoading}
          aria-label="Emergency description"
          aria-multiline="true"
          aria-disabled={isLoading}
        />

        <HoverLift scale={1.05}>
          <button
            onClick={handleSubmit}
            disabled={(!value.trim() && !imageBase64) || isLoading}
            className={cn(
              'p-3 rounded-xl min-w-[48px] min-h-[48px]',
              'flex items-center justify-center',
              'bg-gradient-to-br from-white/20 to-white/10',
              'text-white',
              'shadow-lg border border-white/20',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:bg-white/25 active:scale-95',
              'touch-manipulation'
            )}
            aria-label={isLoading ? 'Processing...' : 'Send message'}
          >
            <Send size={20} />
          </button>
        </HoverLift>
      </div>
    </div>
  );
});

TextInput.displayName = 'TextInput';