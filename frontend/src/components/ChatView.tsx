import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { THREAD_QUERY, SEND_MESSAGE_MUTATION } from '../apollo/operations';
import { useAuth } from '../hooks/useAuth';
import type {
  Thread,
  ThreadQueryVariables,
  ThreadQueryResponse,
  SendMessageMutationVariables,
  SendMessageMutationResponse
} from '../types';

interface ChatViewProps {
  thread: Thread;
}

const ChatView: React.FC<ChatViewProps> = ({ thread }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  const { data, loading, refetch } = useQuery<ThreadQueryResponse, ThreadQueryVariables>(
    THREAD_QUERY,
    {
      variables: { id: thread.id },
      pollInterval: 2000, // Poll every 2 seconds for new messages
    }
  );

  const [sendMessage, { loading: sending }] = useMutation<
    SendMessageMutationResponse,
    SendMessageMutationVariables
  >(SEND_MESSAGE_MUTATION, {
    onCompleted: () => {
      setNewMessage('');
      refetch();
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data?.thread?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        variables: {
          threadId: thread.id,
          content: newMessage.trim(),
        },
      });
    } catch {
      // Error handled by onError callback
    }
  };

  const getOtherParticipant = () => {
    return thread.participants.find(p => p.id !== user?.id);
  };

  const formatMessageTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse">Loading messages...</div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();
  const messages = data?.thread?.messages || [];

  return (
    <div className="flex-1 w-full flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 w-full">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
            <span className="text-white font-semibold text-lg">
              {`Avatar ${otherParticipant?.username?.charAt(0).toUpperCase()}`}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {otherParticipant?.username || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-500">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 w-full overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender.id === user?.id;

            return (
              <div
                key={message.id}
                className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwnMessage
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 w-full">
        <form onSubmit={handleSendMessage} className="flex space-x-2 w-full">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
