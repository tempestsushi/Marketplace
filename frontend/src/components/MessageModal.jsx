import { useEffect, useMemo, useState } from 'react';
import { X, Send } from 'lucide-react';

function MessageModal({
  open,
  title = 'Send message',
  placeholder = 'Type your message…',
  initialMessage = '',
  onClose,
  onSend,
}) {
  const [message, setMessage] = useState(initialMessage);
  const [sending, setSending] = useState(false);
  const canSend = useMemo(() => String(message).trim().length > 0 && !sending, [message, sending]);

  useEffect(() => {
    if (open) setMessage(initialMessage || '');
  }, [open, initialMessage]);

  useEffect(() => {
    function onKeyDown(e) {
      if (!open) return;
      if (e.key === 'Escape') onClose?.();
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (canSend) {
          e.preventDefault();
          void handleSend();
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, canSend, message]);

  async function handleSend() {
    if (!canSend) return;
    setSending(true);
    try {
      await onSend?.(String(message).trim());
      onClose?.();
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close message dialog"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden border border-[#ded6ca] bg-[#fffdf9] shadow-xl">
        <div className="flex items-center justify-between border-b border-[#ded6ca] bg-[#efe8df] px-5 py-4">
          <h3 className="text-sm font-bold text-[#24301f]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 transition-colors hover:bg-[#e4ded2]"
            aria-label="Close"
          >
            <X size={18} className="text-[#596352]" />
          </button>
        </div>

        <div className="p-5">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            rows={5}
            className="w-full resize-none border border-[#ded6ca] bg-white px-4 py-3 text-sm text-[#24301f]
              transition-all duration-200 placeholder:text-[#858b7b] focus:outline-none focus:ring-2 focus:ring-[#304826]"
          />

          <div className="mt-3 flex items-center justify-between text-xs text-[#596352]">
            <span>Tip: press Ctrl+Enter to send</span>
            <span>{String(message).trim().length}/500</span>
          </div>

          <button
            type="button"
            disabled={!canSend}
            onClick={() => void handleSend()}
            className="mt-4 flex w-full items-center justify-center gap-2 bg-[#304826] py-3 text-sm font-semibold text-white
              transition-colors duration-200 hover:bg-[#24381d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send size={16} />
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
