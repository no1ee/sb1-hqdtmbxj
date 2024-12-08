import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { Link } from 'lucide-react';

export default function PairManagement() {
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState('');
  const unpairedClients = useUserStore(state => state.getUnpairedUsers('client'));
  const unpairedReceivers = useUserStore(state => state.getUnpairedUsers('receiver'));
  const pairs = useUserStore(state => state.getPairs());
  const createPair = useUserStore(state => state.createPair);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient && selectedReceiver) {
      createPair(selectedClient, selectedReceiver);
      setSelectedClient('');
      setSelectedReceiver('');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Link className="w-5 h-5 text-blue-500 mr-2" />
        <h2 className="text-lg font-medium text-gray-900">Link Client and Receiver</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">
            Select Client
          </label>
          <select
            id="client"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Select a client...</option>
            {unpairedClients.map(client => (
              <option key={client.id} value={client.username}>
                {client.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="receiver" className="block text-sm font-medium text-gray-700">
            Select Receiver
          </label>
          <select
            id="receiver"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={selectedReceiver}
            onChange={(e) => setSelectedReceiver(e.target.value)}
          >
            <option value="">Select a receiver...</option>
            {unpairedReceivers.map(receiver => (
              <option key={receiver.id} value={receiver.username}>
                {receiver.username}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={!selectedClient || !selectedReceiver}
        >
          Create Link
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Existing Pairs</h3>
        <div className="space-y-2">
          {pairs.map(pair => (
            <div key={pair.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">{pair.clientUsername}</span>
              <span className="text-sm text-gray-400">↔</span>
              <span className="text-sm text-gray-600">{pair.receiverUsername}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}