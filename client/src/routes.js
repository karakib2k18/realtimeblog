import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import PostEditorPage from './pages/PostEditorPage';
import AuthorProfilePage from './pages/AuthorProfilePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import NotFoundPage from './pages/NotFoundPage'; // ✅ import this

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="/editor" element={<PostEditorPage />} />
      <Route path="/author/:authorId" element={<AuthorProfilePage />} />
      <Route path="/subscriptions" element={<SubscriptionsPage />} />
      <Route path="*" element={<NotFoundPage />} /> {/* ✅ catch-all route */}
    </Routes>
  );
}

export default AppRoutes;
