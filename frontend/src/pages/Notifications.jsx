// Notifications + "Pending requests" inbox where you Accept/Reject.
import { useEffect, useState } from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import { Check, X, Bell } from 'lucide-react';

export default function Notifications() {
  const { setNotifications } = useSocket();
  const [notifs, setNotifs]   = useState([]);
  const [pending, setPending] = useState([]);

  const load = async () => {
    const [n, p] = await Promise.all([api.get('/notifications'), api.get('/connections/pending')]);
    setNotifs(n.data); setPending(p.data);
    await api.put('/notifications/read-all');
    setNotifications([]);   // clear unread badge
  };
  useEffect(() => { load(); }, []);

  const respond = async (id, action) => {
    try {
      await api.put(`/connections/${id}/respond`, { action });
      toast.success(action === 'accept' ? 'Connected!' : 'Request rejected');
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Notifications</h1>

      <h2 className="mt-6 font-semibold text-ink-700">Pending connection requests</h2>
      <div className="mt-3 space-y-3">
        {pending.length === 0 && <p className="text-sm text-ink-500">No pending requests.</p>}
        {pending.map((p) => (
          <div key={p._id} className="card flex items-center gap-3">
            <img src={p.requester.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${p.requester.name}`}
                 className="w-12 h-12 rounded-full bg-slate-200" alt=""/>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{p.requester.name}</p>
              <p className="text-xs text-ink-500 truncate">{p.requester.bio || 'Wants to connect with you.'}</p>
            </div>
            <button className="btn-primary" onClick={() => respond(p._id, 'accept')}><Check size={16}/> Accept</button>
            <button className="btn-ghost"    onClick={() => respond(p._id, 'reject')}><X size={16}/></button>
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-semibold text-ink-700">Activity</h2>
      <div className="mt-3 space-y-2">
        {notifs.length === 0 && <p className="text-sm text-ink-500">Nothing yet.</p>}
        {notifs.map((n) => (
          <div key={n._id} className="card flex items-center gap-3">
            <Bell size={18} className="text-brand-600"/>
            <div className="flex-1">
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-ink-500">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
