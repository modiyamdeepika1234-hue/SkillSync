// Left navigation bar. Highlights active route, shows unread notification badge.
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, BookOpen, MessageSquare, User, Bell, LogOut, MessagesSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Logo from './Logo';

const NAV = [
  { to: '/dashboard',      label: 'Dashboard',      icon: Home },
  { to: '/skill-exchange', label: 'Skill Exchange', icon: Users },
  { to: '/chat',           label: 'Messages',       icon: MessagesSquare },
  { to: '/community',      label: 'Community',      icon: MessageSquare },
  { to: '/learning-hub',   label: 'Learning Hub',   icon: BookOpen },
  { to: '/notifications',  label: 'Notifications',  icon: Bell, badge: true },
  { to: '/profile',        label: 'Profile',        icon: User },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { notifications } = useSocket();
  const unread = notifications.filter((n) => !n.read).length;
  const nav = useNavigate();

  return (
    <aside className="hidden md:flex md:w-64 flex-col h-screen sticky top-0 bg-white border-r border-slate-200">
      <div className="p-5 border-b border-slate-100"><Logo /></div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon, badge }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-slate-50'
              }`
            }>
            <span className="flex items-center gap-3"><Icon size={18}/> {label}</span>
            {badge && unread > 0 && (
              <span className="text-xs bg-brand-600 text-white rounded-full px-2 py-0.5">{unread}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
               alt="" className="w-9 h-9 rounded-full bg-slate-200" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-ink-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => { logout(); nav('/login'); }}
          className="btn-ghost w-full mt-1 text-sm"><LogOut size={16}/> Logout</button>
      </div>
    </aside>
  );
}
