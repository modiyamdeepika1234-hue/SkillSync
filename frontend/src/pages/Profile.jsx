import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name:'', bio:'', skillsOffered:'', skillsWanted:'' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      bio: user.bio || '',
      skillsOffered: (user.skillsOffered || []).join(', '),
      skillsWanted:  (user.skillsWanted  || []).join(', '),
    });
  }, [user]);

  const save = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      const { data } = await api.put('/users/me', {
        name: form.name, bio: form.bio,
        skillsOffered: form.skillsOffered.split(',').map(s=>s.trim()).filter(Boolean),
        skillsWanted:  form.skillsWanted.split(',').map(s=>s.trim()).filter(Boolean),
      });
      setUser(data); toast.success('Profile updated');
    } catch { toast.error('Save failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Your profile</h1>
      <p className="text-ink-500 mt-1">Tell others what you can teach and what you want to learn.</p>
      <form onSubmit={save} className="card mt-6 space-y-4">
        <div className="flex items-center gap-4">
          <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
               className="w-16 h-16 rounded-full bg-slate-200" alt=""/>
          <div>
            <p className="font-semibold">{user?.email}</p>
            <p className="text-xs text-ink-500">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
        <div><label className="text-sm font-medium">Name</label>
          <input className="input mt-1" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/></div>
        <div><label className="text-sm font-medium">Bio</label>
          <textarea className="input mt-1" rows="3" value={form.bio} onChange={(e)=>setForm({...form,bio:e.target.value})}/></div>
        <div><label className="text-sm font-medium">Skills you offer (comma separated)</label>
          <input className="input mt-1" placeholder="React, Python, UI Design" value={form.skillsOffered}
            onChange={(e)=>setForm({...form,skillsOffered:e.target.value})}/></div>
        <div><label className="text-sm font-medium">Skills you want to learn</label>
          <input className="input mt-1" placeholder="Machine Learning, Public Speaking" value={form.skillsWanted}
            onChange={(e)=>setForm({...form,skillsWanted:e.target.value})}/></div>
        <button className="btn-primary" disabled={busy}>{busy?'Saving…':'Save changes'}</button>
      </form>
    </div>
  );
}
