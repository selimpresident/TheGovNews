import React, { useState, useMemo } from 'react';
import { ApiKey } from '../../types';
import {
    PlusIcon,
    SearchIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    EyeSlashIcon,
    ClipboardIcon,
    ClipboardCheckIcon,
} from '../../components/Icons';
import { Tooltip } from 'react-tooltip';
import ApiKeyModal from './ApiKeyModal';
import ConfirmModal from './ConfirmModal';

const MOCK_API_KEYS: ApiKey[] = [
    { id: 'key_1', serviceName: 'Gemini', keyName: 'Primary Content Analysis Key', keyValue: `gem-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx${Math.random().toString(36).substring(2, 10)}`, status: 'active', createdAt: '2024-01-15T10:00:00Z', expiresAt: null, usage: { current: 7850, quota: 10000 }, scopes: ['generateContent', 'summarize'] },
    { id: 'key_2', serviceName: 'World Bank', keyName: 'Economic Data Fetcher', keyValue: `wb-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx${Math.random().toString(36).substring(2, 10)}`, status: 'active', createdAt: '2023-11-20T14:30:00Z', expiresAt: '2024-11-20T14:30:00Z', usage: { current: 120, quota: 500 }, scopes: ['indicators:read'] },
    { id: 'key_3', serviceName: 'UCDP', keyName: 'Conflict Data Feed', keyValue: `ucdp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx${Math.random().toString(36).substring(2, 10)}`, status: 'revoked', createdAt: '2023-09-01T09:00:00Z', expiresAt: null, usage: { current: 5000, quota: 5000 }, scopes: ['events:read'] },
    { id: 'key_4', serviceName: 'GDELT', keyName: 'Global Media Monitoring', keyValue: `gdelt-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx${Math.random().toString(36).substring(2, 10)}`, status: 'active', createdAt: '2024-03-10T11:00:00Z', expiresAt: null, usage: { current: 15000, quota: 25000 }, scopes: ['articles:read'] },
];

const ApiKeyManagementPanel: React.FC = () => {
    const [keys, setKeys] = useState(MOCK_API_KEYS);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleKey, setVisibleKey] = useState<string | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState<ApiKey | null | undefined>(null);

    const filteredKeys = useMemo(() => {
        return keys.filter(key =>
            key.keyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            key.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [keys, searchTerm]);

    const handleCopy = (keyValue: string) => {
        navigator.clipboard.writeText(keyValue);
        setCopiedKey(keyValue);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleOpenAddModal = () => {
        setSelectedKey(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (key: ApiKey) => {
        setSelectedKey(key);
        setIsModalOpen(true);
    };

    const handleOpenRevokeConfirm = (key: ApiKey) => {
        setSelectedKey(key);
        setIsConfirmOpen(true);
    };

    const handleSaveKey = (keyToSave: Omit<ApiKey, 'id' | 'createdAt' | 'usage'> & { id?: string }) => {
        if (keyToSave.id) { // Editing existing key
            setKeys(keys.map(k => k.id === keyToSave.id ? { ...k, ...keyToSave } : k));
        } else { // Adding new key
            const newKey: ApiKey = {
                ...keyToSave,
                id: `key_${Date.now()}`,
                createdAt: new Date().toISOString(),
                usage: { current: 0, quota: 10000 }, // Default usage
            };
            setKeys([newKey, ...keys]);
        }
    };
    
    const handleConfirmRevoke = () => {
        if (selectedKey) {
            setKeys(keys.map(k => k.id === selectedKey.id ? { ...k, status: 'revoked' } : k));
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
                 <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">API Key Management</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage, create, and revoke API keys.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="Search keys..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                    <button onClick={handleOpenAddModal} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                        <PlusIcon className="h-5 w-5" />
                        Add New Key
                    </button>
                </div>
            </div>
            <div className="overflow-y-auto flex-grow">
                <table className="min-w-full">
                    <thead className="sticky top-0 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Key Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">API Key</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {filteredKeys.map(key => (
                            <tr key={key.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{key.keyName}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{key.serviceName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${key.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                        {key.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                    <div>{new Date(key.createdAt).toLocaleDateString()}</div>
                                    {key.expiresAt && <div className="text-xs">Expires: {new Date(key.expiresAt).toLocaleDateString()}</div>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                                        <div className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full" style={{ width: `${(key.usage.current / key.usage.quota) * 100}%`}}></div>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{key.usage.current.toLocaleString()} / {key.usage.quota.toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <span>{visibleKey === key.id ? key.keyValue : `••••••••${key.keyValue.slice(-4)}`}</span>
                                        <button onClick={() => setVisibleKey(visibleKey === key.id ? null : key.id)} data-tooltip-id="api-tooltip" data-tooltip-content={visibleKey === key.id ? 'Hide' : 'Show'}>
                                            {visibleKey === key.id ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                        </button>
                                        <button onClick={() => handleCopy(key.keyValue)} data-tooltip-id="api-tooltip" data-tooltip-content={copiedKey === key.keyValue ? 'Copied!' : 'Copy'}>
                                           {copiedKey === key.keyValue ? <ClipboardCheckIcon className="h-5 w-5 text-green-500"/> : <ClipboardIcon className="h-5 w-5"/>}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenEditModal(key)} className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-500 rounded-md" data-tooltip-id="api-tooltip" data-tooltip-content="Edit"><PencilIcon className="h-5 w-5" /></button>
                                    <button onClick={() => handleOpenRevokeConfirm(key)} disabled={key.status === 'revoked'} className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" data-tooltip-id="api-tooltip" data-tooltip-content="Revoke"><TrashIcon className="h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Tooltip id="api-tooltip" className="!bg-slate-900 !text-slate-200 rounded-md shadow-lg !border !border-slate-700 !text-xs z-50" />
            <ApiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveKey} apiKey={selectedKey} />
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmRevoke}
                title="Revoke API Key"
                message="Are you sure you want to revoke this API key? This action cannot be undone."
                confirmText="Revoke"
                confirmVariant="danger"
            />
        </div>
    );
};

export default ApiKeyManagementPanel;