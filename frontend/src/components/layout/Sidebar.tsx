import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onCreateTask: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose, onCreateTask }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'assignment', label: 'Tasks', path: '/tasks' },
    { icon: 'folder_open', label: 'Projects', path: '/projects' },
    { icon: 'bar_chart', label: 'Analytics', path: '/analytics' },
    { icon: 'group', label: 'Team', path: '/team' },
    { icon: 'settings', label: 'Settings', path: '/settings' },
  ];

  const sidebarContent = (
    <>
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold tracking-tighter text-[#4F46E5] font-headline">
          TaskFlow
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-outline font-semibold opacity-60">
          Management
        </p>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#c3c0ff] bg-[#2d3449] font-semibold'
                  : 'text-slate-400 font-medium hover:bg-[#131b2e] hover:text-[#c3c0ff]'
              }`
            }
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {item.icon}
            </span>
            <span className="font-['Manrope'] text-sm tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <button
          onClick={() => {
            onCreateTask();
            onMobileClose();
          }}
          className="w-full bg-gradient-to-br from-primary-container to-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          aria-label="Create new task"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            add
          </span>
          <span>Create Task</span>
        </button>

        <button
          onClick={handleSignOut}
          className="w-full text-slate-400 hover:text-[#c3c0ff] flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#131b2e] transition-colors"
          aria-label="Sign out"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            logout
          </span>
          <span className="font-['Manrope'] text-sm tracking-tight">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 hidden md:flex flex-col bg-[#0b1326] py-8 px-4 z-50 shadow-[0px_20px_40px_rgba(6,14,32,0.4)]">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 flex md:hidden flex-col bg-[#0b1326] py-8 px-4 z-50 shadow-[0px_20px_40px_rgba(6,14,32,0.4)] transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
