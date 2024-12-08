import React from 'react';
import { useAuthStore } from '../../store/authStore';
import UserManagement from './UserManagement';
import PairManagement from './PairManagement';
import { LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const logout = useAuthStore(state => state.logout);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            <UserManagement />
            <PairManagement />
          </div>
        </div>
      </main>
    </div>
  );
}