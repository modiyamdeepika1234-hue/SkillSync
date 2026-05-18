import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SkillExchange from './pages/SKillExchange';
import Community from './pages/Community';
import LearningHub from './pages/Learninghub';
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';

const Page = ({ children }) => <ProtectedRoute><AppLayout>{children}</AppLayout></ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<Landing />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/register"  element={<Register />} />

      <Route path="/dashboard"      element={<Page><Dashboard /></Page>} />
      <Route path="/profile"        element={<Page><Profile /></Page>} />
      <Route path="/skill-exchange" element={<Page><SkillExchange /></Page>} />
      <Route path="/community"      element={<Page><Community /></Page>} />
      <Route path="/learning-hub"   element={<Page><LearningHub /></Page>} />
      <Route path="/notifications"  element={<Page><Notifications /></Page>} />
      <Route path="/chat"           element={<Page><Chat /></Page>} />

      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route path="*"     element={<NotFound />} />
    </Routes>
  );
}
