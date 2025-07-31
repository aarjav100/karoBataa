import React from 'react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import { ChatProvider } from '../../contexts/ChatContext';

const ChatLayout = () => {
  return (
    <ChatProvider>
      <div className="h-screen flex bg-gray-100">
        <ChatSidebar />
        <ChatArea />
      </div>
    </ChatProvider>
  );
};

export default ChatLayout;

