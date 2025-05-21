import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostEditorPage from './pages/PostEditorPage';
import PostDetailPage from './pages/PostDetailPage';
import AuthorProfilePage from './pages/AuthorProfilePage';
import SubscriptionsPage from './pages/SubscriptionsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/editor" element={<PostEditorPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="/author/:authorId" element={<AuthorProfilePage />} />
      <Route path="/subscriptions" element={<SubscriptionsPage />} />
    </Routes>
  );
}

export default AppRoutes;
