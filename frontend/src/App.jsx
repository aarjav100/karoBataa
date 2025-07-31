import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import ChatLayout from './components/chat/ChatLayout';
import './App.css';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      {currentUser ? <ChatLayout /> : <AuthPage />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

