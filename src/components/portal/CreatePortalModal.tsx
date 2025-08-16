import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import { Portal, Topic } from '../../types';
import { CountryMappings } from '../../services/countryDataService';
import { SearchIcon, XCircleIcon, UsersIcon } from '../Icons';
import { generateMockData } from '../../services/mockData';

interface CreatePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (portalData: Omit<Portal, 'id' | 'ownerId' | 'createdAt' | 'lastUpdatedAt'> & { id?: string }) => void;
  portal?: Portal;
  countryMappings: CountryMappings;
}

const allTopics = generateMockData().topics;

const CreatePortalModal: React.FC<CreatePortalModalProps> = ({ isOpen, onClose, onSave, portal, countryMappings }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [collaboratorEmails, setCollaboratorEmails] = useState<string[]>([]);
  const [collaboratorInput, setCollaboratorInput] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (portal) {
        setName(portal.name);
        setDescription(portal.description);
        setSelectedCountries(portal.countries);
        setSelectedTopics(portal.topics);
        setCollaboratorEmails(portal.collaboratorEmails);
        setIsPublic(portal.isPublic);
      } else {
        setName('');
        setDescription('');
        setSelectedCountries([]);
        setSelectedTopics([]);
        setCollaboratorEmails([]);
        setIsPublic(false);
      }
      setCountrySearch('');
      setCollaboratorInput('');
    }
  }, [isOpen, portal]);

  const handleSave = () => {
    onSave({
      id: portal?.id,
      name,
      description,
      countries: selectedCountries,
      topics: selectedTopics,
      isPublic,
      collaboratorEmails,
    });
  };

  const toggleCountry = (countryName: string) => {
    setSelectedCountries(prev =>
      prev.includes(countryName)
        ? prev.filter(c => c !== countryName)
        : [...prev, countryName]
    );
  };
  
   const toggleTopic = (topic: Topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleCollaboratorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && collaboratorInput.trim()) {
        e.preventDefault();
        const email = collaboratorInput.trim().toLowerCase();
        if (email && !collaboratorEmails.includes(email)) {
            setCollaboratorEmails(prev => [...prev, email]);
        }
        setCollaboratorInput('');
    }
  };

  const removeCollaborator = (emailToRemove: string) => {
    setCollaboratorEmails(prev => prev.filter(email => email !== emailToRemove));
  };
  
  const availableCountries = countryMappings.allCountries
    .map(c => ({...c, englishName: countryMappings.turkishToEnglish.get(c.name) || c.name}))
    .filter(c => c.englishName.toLowerCase().includes(countrySearch.toLowerCase()));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={portal ? 'Edit Portal' : 'Create New Portal'}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-analyst-input text-slate-800 dark:text-analyst-text-primary text-sm font-semibold hover:bg-slate-300 dark:hover:bg-analyst-item-hover transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-analyst-accent text-white text-sm font-semibold hover:bg-analyst-accent/90 transition-colors">
            {portal ? 'Save Changes' : 'Create Portal'}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-analyst-text-primary">Portal Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full text-sm rounded-md border-analyst-border bg-analyst-input shadow-sm focus:border-analyst-accent focus:ring-analyst-accent" placeholder="e.g., European Energy Security" />
        </div>
        <div>
          <label className="block text-sm font-medium text-analyst-text-primary">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="mt-1 block w-full text-sm rounded-md border-analyst-border bg-analyst-input shadow-sm focus:border-analyst-accent focus:ring-analyst-accent" placeholder="A brief description of this portal's focus."></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-analyst-text-primary mb-2">Countries</label>
                <div className="relative mb-2">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-analyst-text-secondary" />
                    <input type="text" value={countrySearch} onChange={e => setCountrySearch(e.target.value)} placeholder="Search..." className="w-full h-9 bg-analyst-input border-analyst-border rounded-lg pl-9 pr-3 text-sm focus:ring-2 focus:ring-analyst-accent/50 focus:outline-none" />
                </div>
                <div className="max-h-40 overflow-y-auto p-2 border border-analyst-border rounded-lg bg-analyst-input/50 space-y-1">
                    {availableCountries.map(country => (
                         <label key={country.name} className="flex items-center gap-3 p-2 rounded-md hover:bg-analyst-item-hover cursor-pointer">
                            <input type="checkbox" checked={selectedCountries.includes(country.name)} onChange={() => toggleCountry(country.name)} className="h-4 w-4 rounded border-slate-400 text-analyst-accent focus:ring-analyst-accent"/>
                             <img src={country.flag} alt="" className="w-5 h-auto rounded-sm" />
                            <span className="text-sm">{country.englishName}</span>
                         </label>
                    ))}
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-analyst-text-primary mb-2">Topics</label>
                 <div className="max-h-48 overflow-y-auto p-2 border border-analyst-border rounded-lg bg-analyst-input/50 space-y-1">
                    {allTopics.map(topic => (
                         <label key={topic} className="flex items-center gap-3 p-2 rounded-md hover:bg-analyst-item-hover cursor-pointer">
                            <input type="checkbox" checked={selectedTopics.includes(topic)} onChange={() => toggleTopic(topic)} className="h-4 w-4 rounded border-slate-400 text-analyst-accent focus:ring-analyst-accent"/>
                            <span className="text-sm capitalize">{topic.replace('-', ' ')}</span>
                         </label>
                    ))}
                </div>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-analyst-text-primary mb-2">Collaborators</label>
            <div className="relative">
                <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-analyst-text-secondary" />
                <input 
                    type="email" 
                    value={collaboratorInput}
                    onChange={e => setCollaboratorInput(e.target.value)}
                    onKeyDown={handleCollaboratorKeyDown}
                    placeholder="Add by email and press Enter..." 
                    className="w-full h-9 bg-analyst-input border-analyst-border rounded-lg pl-9 pr-3 text-sm focus:ring-2 focus:ring-analyst-accent/50 focus:outline-none" />
            </div>
            {collaboratorEmails.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {collaboratorEmails.map(email => (
                        <span key={email} className="flex items-center gap-1.5 bg-analyst-accent/20 text-analyst-accent text-xs font-medium pl-2 pr-1 py-0.5 rounded-full">
                            {email}
                            <button onClick={() => removeCollaborator(email)}><XCircleIcon className="h-4 w-4"/></button>
                        </span>
                    ))}
                </div>
             )}
        </div>

      </div>
    </Modal>
  );
};

export default CreatePortalModal;