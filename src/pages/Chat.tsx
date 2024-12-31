'use client';

import { useEffect, useState } from 'react';
import { IMessage, IChat } from '@/lib/types';

export default function Chats() {
  const [chats, setChats] = useState<IChat[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    // get the chats that exist
    const fetchChats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/chat');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch chats');
        }

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch chats');
        }

        setChats(data.chats || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Failed to fetch chats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    // get the messages for the selected chat
    const fetchMessages = async () => {
      if (!selectedChatId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/chat/${selectedChatId}/get`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch messages');
        }

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch messages');
        }

        setMessages(data.messages || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChatId]);

  const selectedChat = chats.find((chat) => chat._id === selectedChatId);

  const sendMessage = async () => {
    // send a message to the selected chat
    if (!selectedChatId || !messageInput.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/chat/${selectedChatId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Clear input and refresh messages
      setMessageInput('');
      const messagesResponse = await fetch(`/api/chat/${selectedChatId}/get`);
      const messagesData = await messagesResponse.json();
      setMessages(messagesData.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/5 border-r border-gray-200 overflow-y-auto">
        <h1 className="p-4 text-xl font-bold border-b border-gray-200">
          Chats ({chats.length})
        </h1>
        <div className="space-y-2">
          {chats.length === 0 ? (
            <div className="p-4 text-gray-500">No chats available</div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => chat._id && setSelectedChatId(chat._id)}
                className={`w-full text-left p-4 hover:bg-gray-50 ${
                  selectedChatId === chat._id ? 'bg-blue-50' : ''
                }`}
              >
                <span>{chat.participants.join(', ')}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold">
                {selectedChat.participants.join(', ')}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div key={message._id} className="mb-4">
                  <div className="font-bold">{message.user}</div>
                  <div>{message.content}</div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex space-x-2"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
