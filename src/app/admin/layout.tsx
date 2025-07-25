
import React, { useState, ReactNode } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = 'https://app.matson.app/';
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyan-100 via-white to-cyan-200">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 shadow-2xl rounded-r-2xl`}
      >
        <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
          <h1 className="text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Matson Admin
          </h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-4">
            <li>
              <Link
                to="/admin"
                className={`flex items-center p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-cyan-500/20`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v7h4v-7m-4 0H5l7-7 7 7H15v7h4v-7m-7 7V5"></path>
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/create-user"
                className={`flex items-center p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-cyan-500/20`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0H3z"></path>
                </svg>
                Create New Couple User
              </Link>
            </li>
            <li>
              <Link
                to="/admin/manage-couple-users"
                className={`flex items-center p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-cyan-500/20`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Manage Couple Users
              </Link>
            </li>
            <li>
              <Link
                to="/admin/manage-partner-users"
                className={`flex items-center p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-cyan-500/20`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Manage Partner Users
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-red-500/20 text-white hover:text-red-300"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8">
        <button
          className="md:hidden mb-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors transform hover:scale-105"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰ Menu
        </button>
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
