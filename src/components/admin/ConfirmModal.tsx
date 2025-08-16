import React from 'react';
import Modal from '../Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'primary' }) => {

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  const confirmButtonClasses = {
      primary: 'bg-analyst-accent hover:bg-analyst-accent/90',
      danger: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-analyst-input text-slate-800 dark:text-analyst-text-primary text-sm font-semibold hover:bg-slate-300 dark:hover:bg-analyst-item-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors ${confirmButtonClasses[confirmVariant]}`}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-slate-600 dark:text-analyst-text-secondary">{message}</p>
    </Modal>
  );
};

export default ConfirmModal;