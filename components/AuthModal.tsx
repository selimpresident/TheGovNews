import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CloseIcon, UserCircleIcon } from './Icons';
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
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Check your email</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        If an account exists for {email}, you will receive an email with instructions on how to reset your password.
                    </p>
                    <button onClick={() => setView('login')} className="mt-6 text-sm font-semibold text-blue-600 dark:text-blue-500 hover:underline">
                        &larr; Back to Login
                    </button>
                </div>
            );
        case 'forgotPassword':
            return (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                        <label htmlFor="email-forgot" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                        <input id="email-forgot" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                        {loading ? <Spinner/> : 'Send Reset Link'}
                    </button>
                </form>
            );
      case 'register':
        return (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="email-reg" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input id="email-reg" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="password-reg" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input id="password-reg" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {loading ? <Spinner/> : 'Create Account'}
            </button>
          </form>
        );
      case 'login':
      default:
        return (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email-login" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input id="email-login" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="password-login" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <input id="password-login" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
             <div className="flex items-center justify-end">
                <div className="text-sm">
                    <button type="button" onClick={() => setView('forgotPassword')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400">
                       Forgot your password?
                    </button>
                </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
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
            <p className="text-sm text-slate-600 dark:text-slate-400">Not a member? <button onClick={() => setView('register')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400">Create an account</button></p>
        );
        case 'register': return (
            <p className="text-sm text-slate-600 dark:text-slate-400">Already have an account? <button onClick={() => setView('login')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400">Sign in</button></p>
        );
        case 'forgotPassword': return (
             <p className="text-sm text-slate-600 dark:text-slate-400">Remember your password? <button onClick={() => setView('login')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400">Sign in</button></p>
        );
        default: return null;
    }
  };

  return (
    <div className={`fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={handleClose}>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <header className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 sr-only">{getTitle()}</h2>
             <div className="w-12 h-12 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                 <UserCircleIcon className="w-8 h-8 text-slate-500 dark:text-slate-400" />
            </div>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors absolute top-3 right-3" aria-label="Close">
                <CloseIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            </button>
        </header>
        <div className="p-8 pt-4">
            <h3 className="text-center text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">{getTitle()}</h3>
            {error && <p className="mb-4 text-center text-sm text-red-600 dark:text-red-500 bg-red-100/50 dark:bg-red-500/10 p-3 rounded-md">{error}</p>}
            {successMessage && <p className="mb-4 text-center text-sm text-green-600 dark:text-green-500 bg-green-100/50 dark:bg-green-500/10 p-3 rounded-md">{successMessage}</p>}
            {renderContent()}
        </div>
        <footer className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-center rounded-b-lg">
           {getFooter()}
        </footer>
      </div>
    </div>
  );
};

export default AuthModal;
