import React from 'react';
import DashboardSidebar from './DashboardSideBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const PAGE_MARGINS = {
  padding: 'p-8',
  marginLeft: 'ml-20',
  marginLeftMd: 'md:ml-34',
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div
        className={`overflow-x-auto flex-1 ${PAGE_MARGINS.padding} ${PAGE_MARGINS.marginLeft} ${PAGE_MARGINS.marginLeftMd}`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;