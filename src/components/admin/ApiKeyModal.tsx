import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { ApiKey } from '../../types';
import { XCircleIcon } from '../Icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: Omit<ApiKey, 'id' | 'createdAt' | 'usage'> & { id?: string }) => void;
  apiKey: ApiKey | null | undefined; // undefined for new, ApiKey for edit
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, apiKey }) => {
  const [keyData, setKeyData] = useState<Omit<ApiKey, 'id' | 'createdAt' | 'usage'> & { id?: string }>({
    keyName: '',
    serviceName: 'Gemini',
    keyValue: '',
    status: 'active',
    expiresAt: null,
    scopes: [],
  });
  const [scopeInput, setScopeInput] = useState('');

  useEffect(() => {
    if (apiKey) {
      setKeyData({ ...apiKey });
    } else {
      setKeyData({
        keyName: '',
        serviceName: 'Gemini',
        keyValue: '',
        status: 'active',
        expiresAt: null,
        scopes: [],
      });
    }
  }, [apiKey, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setKeyData(prev => ({ ...prev, [name]: value }));
  };

  const handleScopeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && scopeInput.trim()) {
      e.preventDefault();
      if (!keyData.scopes.includes(scopeInput.trim())) {
        setKeyData(prev => ({ ...prev, scopes: [...prev.scopes, scopeInput.trim()] }));
      }
      setScopeInput('');
    }
  };

  const removeScope = (scopeToRemove: string) => {
    setKeyData(prev => ({ ...prev, scopes: prev.scopes.filter(scope => scope !== scopeToRemove) }));
  };
  
  const handleSave = () => {
    onSave(keyData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={apiKey ? 'Edit API Key' : 'Add New API Key'}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-analyst-input text-slate-800 dark:text-analyst-text-primary text-sm font-semibold hover:bg-slate-300 dark:hover:bg-analyst-item-hover transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-analyst-accent text-white text-sm font-semibold hover:bg-analyst-accent/90 transition-colors">
            Save Changes
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-analyst-text-primary">Key Name</label>
          <input type="text" name="keyName" value={keyData.keyName} onChange={handleChange} className="mt-1 block w-full text-sm rounded-md border-slate-300 dark:border-analyst-border bg-white dark:bg-analyst-input shadow-sm focus:border-analyst-accent focus:ring-analyst-accent" />
        </div>
         <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-analyst-text-primary">Service</label>
          <select name="serviceName" value={keyData.serviceName} onChange={handleChange} className="mt-1 block w-full text-sm rounded-md border-slate-300 dark:border-analyst-border bg-white dark:bg-analyst-input shadow-sm focus:border-analyst-accent focus:ring-analyst-accent">
            <option>Gemini</option>
            <option>World Bank</option>
            <option>UCDP</option>
            <option>GDELT</option>
            <option>OECD</option>
            <option>NOAA</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-analyst-text-primary">API Key</label>
          <input type="text" name="keyValue" value={keyData.keyValue} onChange={handleChange} className="mt-1 block w-full text-sm rounded-md border-slate-300 dark:border-analyst-border bg-white dark:bg-analyst-input shadow-sm focus:border-analyst-accent focus:ring-analyst-accent" />
          <p className="mt-1 text-xs text-slate-500 dark:text-analyst-text-secondary">This key will be stored securely. Do not share it publicly.</p>
        </div>
         <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-analyst-text-primary">Permissions / Scopes</label>
          <div className="mt-1 flex flex-wrap gap-2 p-2 border border-slate-300 dark:border-analyst-border rounded-md">
            {keyData.scopes.map(scope => (
                <span key={scope} className="flex items-center gap-1.5 bg-blue-100 dark:bg-analyst-accent/20 text-blue-800 dark:text-analyst-accent text-xs font-medium px-2 py-1 rounded-full">
                    {scope}
                    <button onClick={() => removeScope(scope)}><XCircleIcon className="h-4 w-4 text-blue-500 hover:text-blue-700"/></button>
                </span>
            ))}
            <input 
                type="text" 
                value={scopeInput}
                onChange={e => setScopeInput(e.target.value)}
                onKeyDown={handleScopeKeyDown}
                placeholder="Enter scope and press Enter"
                className="flex-grow bg-transparent focus:outline-none text-sm"
            />
          </div>
        </div>
         <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-analyst-text-primary">Expiration Date</label>
          <input type="date" name="expiresAt" value={keyData.expiresAt ? keyData.expiresAt.split('T')[0] : ''} onChange={handleChange} className="mt-1 block w-full text-sm rounded-md border-slate-300 dark:border-analyst-border bg-white dark:bg-analyst-input shadow-sm focus:border-analyst-accent focus:ring-analyst-accent" />
        </div>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;