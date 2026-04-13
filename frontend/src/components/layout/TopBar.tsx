import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../ui/Avatar';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 h-16 w-full md:w-[calc(100%-16rem)] bg-[#0b1326]/80 backdrop-blur-xl border-b border-outline-variant/10 z-40 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="bg-surface-container-highest rounded-full px-4 py-1.5 flex items-center gap-2 w-full max-w-xs md:max-w-sm lg:max-w-md">
          <span className="material-symbols-outlined text-outline text-sm" aria-hidden="true">
            search
          </span>
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline/50 w-full"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button
          className="relative text-slate-400 hover:text-white transition-colors"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" aria-hidden="true" />
        </button>

        <button className="text-slate-400 hover:text-white transition-colors" aria-label="Messages">
          <span className="material-symbols-outlined">chat_bubble</span>
        </button>

        <div className="h-8 w-px bg-outline-variant/30 hidden md:block" aria-hidden="true" />

        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-white">{user?.displayName || 'User'}</p>
            <p className="text-[10px] text-primary font-medium">Administrator</p>
          </div>
          <Avatar src={user?.photoURL} alt={user?.displayName || 'User'} size="md" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
