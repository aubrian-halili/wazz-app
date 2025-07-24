import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { THREADS_QUERY, CREATE_THREAD_MUTATION } from '../apollo/operations';
import { useAuth } from '../hooks/useAuth';
import type {
  ThreadsQueryResponse,
  CreateThreadMutationVariables,
  CreateThreadMutationResponse,
  Thread
} from '../types';

interface ThreadListProps {
  onSelectThread: (thread: Thread) => void;
  selectedThreadId?: string;
}

const ThreadList: React.FC<ThreadListProps> = ({ onSelectThread, selectedThreadId }) => {
  const [newThreadUsername, setNewThreadUsername] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();

  const { data, loading, refetch } = useQuery<ThreadsQueryResponse>(THREADS_QUERY, {
    pollInterval: 5000, // Poll every 5 seconds for new threads
  });

  const [createThread, { loading: creating }] = useMutation<
    CreateThreadMutationResponse,
    CreateThreadMutationVariables
  >(CREATE_THREAD_MUTATION, {
    onCompleted: (data) => {
      onSelectThread(data.createThread);
      setNewThreadUsername('');
      setShowNewThreadForm(false);
      setError('');
      refetch();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newThreadUsername.trim()) {
      setError('Please enter a username');
      return;
    }

    try {
      await createThread({
        variables: { participantUsername: newThreadUsername.trim() },
      });
    } catch {
      // Error handled by onError callback
    }
  };

  const getOtherParticipant = (thread: Thread) => {
    return thread.participants.find(p => p.id !== user?.id);
  };

  const getLastMessage = (thread: Thread) => {
    return thread.messages[0]; // Messages are sorted by createdAt desc in backend
  };

  if (loading) {
    return (
      <div className="w-1/3 bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse">Loading threads...</div>
      </div>
    );
  }

  return (
    <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowNewThreadForm(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              New Chat
            </button>
            <button
              onClick={logout}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Logged in as {user?.username}</p>
      </div>

      {/* New Thread Form */}
      {showNewThreadForm && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleCreateThread}>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter username to start a chat..."
                value={newThreadUsername}
                onChange={(e) => setNewThreadUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={creating}
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewThreadForm(false);
                    setNewThreadUsername('');
                    setError('');
                  }}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {!data?.threads?.length ? (
          <div className="p-4 text-gray-500 text-center">
            No conversations yet. Start a new chat!
          </div>
        ) : (
          data.threads.map((thread) => {
            const otherParticipant = getOtherParticipant(thread);
            const lastMessage = getLastMessage(thread);
            const isSelected = selectedThreadId === thread.id;

            return (
              <div
                key={thread.id}
                onClick={() => onSelectThread(thread)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {otherParticipant?.username || 'Unknown User'}
                    </h3>
                    {lastMessage && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {lastMessage.sender.id === user?.id ? 'You: ' : ''}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lastMessage && new Date(lastMessage.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ThreadList;
