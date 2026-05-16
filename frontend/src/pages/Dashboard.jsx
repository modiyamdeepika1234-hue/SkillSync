import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Users, MessageSquare, Bell, BookOpen } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ posts: 0, pending: 0, notifs: 0 });
  useEffect(() => {
    Promise.all([
      api.get('/posts'), api.get('/connections/pending'), api.get('/notifications'),
    ]).then(([p, c, n]) => setStats({ posts: p.data.length, pending: c.data.length, notifs: n.data.filter(x=>!x.read).length }));
  }, []);

  const cards = [
    { label: 'Connections', val: user?.connections?.length || 0, icon: Users, color: 'bg-brand-50 text-brand-700' },
    { label: 'Pending requests', val: stats.pending, icon: Bell, color: 'bg-amber-50 text-amber-700' },
    { label: 'Community posts', val: stats.posts, icon: MessageSquare, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Skills offered', val: user?.skillsOffered?.length || 0, icon: BookOpen, color: 'bg-violet-50 text-violet-700' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="text-ink-500 mt-1">Here's a snapshot of your SkillSync activity.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {cards.map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}><Icon size={18}/></div>
            <p className="mt-3 text-3xl font-bold">{val}</p>
            <p className="text-sm text-ink-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 card">
        <h2 className="font-semibold">Your skills offered</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {user?.skillsOffered?.length
            ? user.skillsOffered.map((s)=><span key={s} className="chip">{s}</span>)
            : <p className="text-sm text-ink-500">Add skills from your Profile page to start matching.</p>}
        </div>
      </div>
    </div>
  );
}
