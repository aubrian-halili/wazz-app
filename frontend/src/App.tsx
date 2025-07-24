import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Dashboard /> : <Login />;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
