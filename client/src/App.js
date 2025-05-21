import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext'; // ✅ ADD THIS
import Navbar from './components/Navbar';

// Page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import PostEditorPage from './pages/PostEditorPage';
import AuthorProfilePage from './pages/AuthorProfilePage';
import SubscriptionsPage from './pages/SubscriptionsPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider> {/* ✅ WRAPPED HERE */}
        <Router>
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/editor" element={<PostEditorPage />} />
              <Route path="/author/:authorId" element={<AuthorProfilePage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
