
import React, { useEffect, useRef } from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = '2xl' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = {
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={`bg-white dark:bg-analyst-sidebar border border-slate-200 dark:border-analyst-border rounded-lg shadow-2xl w-full ${sizeClasses[size]} flex flex-col max-h-[90vh]`}
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-200 dark:border-analyst-border flex items-center justify-between flex-shrink-0">
          <h2 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-analyst-text-primary">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-analyst-item-hover transition-colors" aria-label="Close">
            <CloseIcon className="w-6 h-6 text-slate-500 dark:text-analyst-text-secondary" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto flex-grow">
            {children}
        </main>
        {footer && (
          <footer className="p-4 border-t border-slate-200 dark:border-analyst-border flex justify-end gap-3 flex-shrink-0 bg-slate-50 dark:bg-analyst-sidebar/50 rounded-b-lg">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

export default Modal;