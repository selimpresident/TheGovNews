import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CloseIcon, UserCircleIcon } from './ui/Icons';
import { Spinner } from './Spinner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = 'login' | 'register' | 'forgotPassword' | 'forgotPasswordSuccess';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<AuthView>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleClose = () => {
    // Reset state on close
    setError('');
    setSuccessMessage('');
    setName('');
    setEmail('');
    setPassword('');
    setView('login');
    onClose();
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
        await register(name, email, password);
        setSuccessMessage("Registration successful! You can now log in.");
        setView('login');
    } catch (err) {
        setError((err as Error).message);
    } finally {
        setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
        await login(email, password);
        handleClose();
    } catch (err) {
        setError((err as Error).message);
    } finally {
        setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     setLoading(true);
     // SIMULATION: In a real app, this would trigger a backend API call to send an email.
     console.log(`Password reset requested for ${email}. A reset token would be generated and emailed.`);
     setTimeout(() => {
        setLoading(false);
        setView('forgotPasswordSuccess');
     }, 1000);
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (view) {
        case 'forgotPasswordSuccess':
            return (
                 <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-analyst-text-primary">Check your email</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-analyst-text-secondary">
                        If an account exists for {email}, you will receive an email with instructions on how to reset your password.
                    </p>
                    <button onClick={() => setView('login')} className="mt-6 text-sm font-semibold text-analyst-accent hover:underline">
                        &larr; Back to Login
                    </button>
                </div>
            );
        case 'forgotPassword':
            return (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                        <label htmlFor="email-forgot" className="block text-sm font-medium text-slate-700 dark:text-analyst-text-secondary">Email Address</label>
                        <input id="email-forgot" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-analyst-input border border-slate-300 dark:border-analyst-border rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-analyst-accent focus:ring-1 focus:ring-analyst-accent" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-analyst-accent hover:bg-analyst-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-analyst-accent disabled:opacity-50">
                        {loading ? <Spinner/> : 'Send Reset Link'}
                    </button>
                </form>
            );
      case 'register':
        return (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-analyst-text-secondary">Full Name</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-analyst-input border border-slate-300 dark:border-analyst-border rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-analyst-accent focus:ring-1 focus:ring-analyst-accent" />
            </div>
            <div>
              <label htmlFor="email-reg" className="block text-sm font-medium text-slate-700 dark:text-analyst-text-secondary">Email Address</label>
              <input id="email-reg" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-analyst-input border border-slate-300 dark:border-analyst-border rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-analyst-accent focus:ring-1 focus:ring-analyst-accent" />
            </div>
            <div>
              <label htmlFor="password-reg" className="block text-sm font-medium text-slate-700 dark:text-analyst-text-secondary">Password</label>
              <input id="password-reg" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-analyst-input border border-slate-300 dark:border-analyst-border rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-analyst-accent focus:ring-1 focus:ring-analyst-accent" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-analyst-accent hover:bg-analyst-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-analyst-accent disabled:opacity-50">
                {loading ? <Spinner/> : 'Create Account'}
            </button>
          </form>
        );
      case 'login':
      default:
        return (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email-login" className="block text-sm font-medium text-slate-700 dark:text-analyst-text-secondary">Email Address</label>
              <input id="email-login" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-analyst-input border border-slate-300 dark:border-analyst-border rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-analyst-accent focus:ring-1 focus:ring-analyst-accent" />
            </div>
            <div>
              <label htmlFor="password-login" className="block text-sm font-medium text-slate-700 dark:text-analyst-text-secondary">Password</label>
              <input id="password-login" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-analyst-input border border-slate-300 dark:border-analyst-border rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-analyst-accent focus:ring-1 focus:ring-analyst-accent" />
            </div>
             <div className="flex items-center justify-end">
                <div className="text-sm">
                    <button type="button" onClick={() => setView('forgotPassword')} className="font-medium text-analyst-accent hover:underline">
                       Forgot your password?
                    </button>
                </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-analyst-accent hover:bg-analyst-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-analyst-accent disabled:opacity-50">
                 {loading ? <Spinner/> : 'Sign In'}
            </button>
          </form>
        );
    }
  };

  const getTitle = () => {
    switch (view) {
        case 'login': return 'Sign in to your account';
        case 'register': return 'Create a new account';
        case 'forgotPassword': return 'Reset your password';
        case 'forgotPasswordSuccess': return 'Request Sent';
        default: return '';
    }
  };
  
  const getFooter = () => {
    switch (view) {
        case 'login': return (
            <p className="text-sm text-slate-600 dark:text-analyst-text-secondary">Not a member? <button onClick={() => setView('register')} className="font-medium text-analyst-accent hover:underline">Create an account</button></p>
        );
        case 'register': return (
            <p className="text-sm text-slate-600 dark:text-analyst-text-secondary">Already have an account? <button onClick={() => setView('login')} className="font-medium text-analyst-accent hover:underline">Sign in</button></p>
        );
        case 'forgotPassword': return (
             <p className="text-sm text-slate-600 dark:text-analyst-text-secondary">Remember your password? <button onClick={() => setView('login')} className="font-medium text-analyst-accent hover:underline">Sign in</button></p>
        );
        default: return null;
    }
  };

  return (
    <div className={`fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={handleClose}>
      <div className="bg-white dark:bg-analyst-sidebar border border-slate-200 dark:border-analyst-border rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <header className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-analyst-text-primary sr-only">{getTitle()}</h2>
             <div className="w-12 h-12 mx-auto bg-slate-200 dark:bg-analyst-input rounded-full flex items-center justify-center">
                 <UserCircleIcon className="w-8 h-8 text-slate-500 dark:text-analyst-text-secondary" />
            </div>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-analyst-item-hover transition-colors absolute top-3 right-3" aria-label="Close">
                <CloseIcon className="w-6 h-6 text-slate-500 dark:text-analyst-text-secondary" />
            </button>
        </header>
        <div className="p-8 pt-4">
            <h3 className="text-center text-xl font-bold text-slate-900 dark:text-analyst-text-primary mb-6">{getTitle()}</h3>
            {error && <p className="mb-4 text-center text-sm text-red-600 dark:text-red-500 bg-red-100/50 dark:bg-red-500/10 p-3 rounded-md">{error}</p>}
            {successMessage && <p className="mb-4 text-center text-sm text-green-600 dark:text-green-500 bg-green-100/50 dark:bg-green-500/10 p-3 rounded-md">{successMessage}</p>}
            {renderContent()}
        </div>
        <footer className="px-8 py-4 bg-slate-50 dark:bg-analyst-sidebar/50 border-t border-slate-200 dark:border-analyst-border text-center rounded-b-lg">
           {getFooter()}
        </footer>
      </div>
    </div>
  );
};

export default AuthModal;