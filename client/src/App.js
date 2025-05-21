import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppNavbar from './components/Navbar';
import Routes from './routes';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppNavbar />
          <div className="container mt-4">
            <Routes />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
