
import React from 'react';
import NotificationBell from '@/components/NotificationBell';

const Header = () => {
  return (
    <header className="flex-shrink-0 bg-slate-900/70 backdrop-blur-lg border-b border-white/10">
      <div className="flex items-center justify-end h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <NotificationBell />
        </div>
      </div>
    </header>
  );
};

export default Header;
