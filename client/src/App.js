import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppNavbar from './components/Navbar';
import Routes from './routes';
import ScrollToTop from './utils/ScrollToTop'; // ✅ Scroll to top on route change
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppNavbar />
          <ScrollToTop />
          <ToastContainer position="bottom-right" autoClose={4000} pauseOnHover theme="light" />
          <div className="container mt-4">
            <Routes />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
