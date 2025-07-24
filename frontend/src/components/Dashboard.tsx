import React, { useState } from 'react';
import ThreadList from './ThreadList';
import ChatView from './ChatView';
import type { Thread } from '../types';

const Dashboard: React.FC = () => {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  return (
    <div className="h-screen w-full flex bg-gray-100">
      <ThreadList
        onSelectThread={setSelectedThread}
        selectedThreadId={selectedThread?.id}
      />

      {selectedThread ? (
        <ChatView thread={selectedThread} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to Wazz
            </h3>
            <p className="text-gray-500">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
