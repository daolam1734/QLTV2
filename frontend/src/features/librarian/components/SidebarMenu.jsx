// src/features/librarian/components/SidebarMenu.jsx
import React from 'react';
import '../styles/SidebarMenu.css';

export default function SidebarMenu({ activeTab, setActiveTab }) {
  return (
    <div className="sidebar-menu">
      <h3>📘 Quản lý</h3>
      <ul>
        <li className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>
          📚 Sách
        </li>
        <li className={activeTab === 'readers' ? 'active' : ''} onClick={() => setActiveTab('readers')}>
          👤 Độc giả
        </li>
        <li className={activeTab === 'borrows' ? 'active' : ''} onClick={() => setActiveTab('borrows')}>
          🔄 Mượn trả
        </li>
        <li className={activeTab === 'violations' ? 'active' : ''} onClick={() => setActiveTab('violations')}>
          ⚠️ Vi phạm
        </li>
      </ul>
    </div>
  );
}
