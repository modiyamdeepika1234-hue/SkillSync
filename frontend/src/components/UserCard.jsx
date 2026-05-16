import { useState } from 'react';
import { UserPlus, Check, Clock } from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function UserCard({ user, isConnected, isPending, onChange }) {
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    try {
      setLoading(true);
      await api.post(`/connections/${user._id}`);
      toast.success(`Request sent to ${user.name}`);
      onChange?.();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <img src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
             className="w-12 h-12 rounded-full bg-slate-200" alt="" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{user.name}</p>
          <p className="text-xs text-ink-500 truncate">{user.email}</p>
        </div>
      </div>
      {user.bio && <p className="text-sm text-ink-700 line-clamp-2">{user.bio}</p>}
      {user.skillsOffered?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {user.skillsOffered.slice(0, 4).map((s) => <span key={s} className="chip">{s}</span>)}
        </div>
      )}
      {isConnected ? (
        <button className="btn-outline" disabled><Check size={16}/> Connected</button>
      ) : isPending ? (
        <button className="btn-ghost" disabled><Clock size={16}/> Pending</button>
      ) : (
        <button className="btn-primary" disabled={loading} onClick={sendRequest}>
          <UserPlus size={16}/> Connect
        </button>
      )}
    </div>
  );
}
