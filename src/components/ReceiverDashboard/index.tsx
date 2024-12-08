import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import AnnouncementPlayer from './AnnouncementPlayer';
import { LogOut } from 'lucide-react';

export default function ReceiverDashboard() {
  const logout = useAuthStore(state => state.logout);
  const currentUser = useAuthStore(state => state.currentUser);
  const pairs = useUserStore(state => state.pairs);

  const userPair = pairs.find(pair => pair.receiverUsername === currentUser?.username);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Receiver Dashboard</h1>
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
        {userPair ? (
          <AnnouncementPlayer pairId={userPair.id} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              You haven't been linked to a client yet. Please contact the administrator.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}