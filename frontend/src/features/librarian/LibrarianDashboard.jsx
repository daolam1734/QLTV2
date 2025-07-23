import React, { useState } from 'react';
import SidebarMenu from './components/SidebarMenu';
import ReaderManager from './readers/ReaderManager';
import BookManager from './books/BookManager';
import BorrowManager from './borrowed/BorrowManager';
import ViolationManager from './violation/ViolationManager';
import './styles/LibrarianDashboard.css';

export default function LibrarianDashboard() {
  const [activeTab, setActiveTab] = useState('books');

  const renderContent = () => {
    switch (activeTab) {
      case 'readers': return <ReaderManager />;
      case 'books': return <BookManager />;
      case 'borrows': return <BorrowManager />;
      case 'violations': return <ViolationManager />;
      default: return <BookManager />;
    }
  };

  return (
    <div className="librarian-dashboard">
      <SidebarMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}
