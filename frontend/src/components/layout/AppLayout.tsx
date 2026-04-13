import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CreateTaskModal from '../task/CreateTaskModal';

export const AppLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const handleMobileMenuToggle = (): void => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileMenuClose = (): void => {
    setIsMobileMenuOpen(false);
  };

  const handleCreateTaskOpen = (): void => {
    setIsCreateTaskModalOpen(true);
  };

  const handleCreateTaskClose = (): void => {
    setIsCreateTaskModalOpen(false);
  };

  const handleCreateTaskSuccess = (): void => {
    setIsCreateTaskModalOpen(false);
    // Optionally trigger a refetch or show a success toast
  };

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
        onCreateTask={handleCreateTaskOpen}
      />
      <TopBar onMenuClick={handleMobileMenuToggle} />

      <main className="md:ml-64 pt-16">
        <Outlet />
      </main>

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={handleCreateTaskClose}
        onSuccess={handleCreateTaskSuccess}
      />
    </div>
  );
};

export default AppLayout;
