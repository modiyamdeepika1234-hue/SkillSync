import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import UserCard from '../components/UserCard';
import { useAuth } from '../context/AuthContext';

export default function SkillExchange() {
  const { user } = useAuth();
  const [users, setUsers]       = useState([]);
  const [pending, setPending]   = useState([]);     // requests I sent (still pending)
  const [query, setQuery]       = useState('');

  const load = async () => {
    const [u, c] = await Promise.all([
      api.get('/users'),
      api.get('/connections'),                       // accepted
    ]);
    setUsers(u.data);
    // Build pending-out list by checking outgoing requests:
    const pendOut = await api.get('/connections/pending').then(()=>[]); // not used here
    setPending(pendOut);
  };
  useEffect(() => { load(); }, []);

  const connectedIds = useMemo(() => new Set((user?.connections || []).map(String)), [user]);

  const filtered = users.filter((u) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return u.name.toLowerCase().includes(q)
      || (u.skillsOffered || []).some((s) => s.toLowerCase().includes(q));
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Skill Exchange</h1>
      <p className="text-ink-500 mt-1">Discover learners and send connection requests.</p>
      <input className="input mt-4 max-w-md" placeholder="Search by name or skill…"
        value={query} onChange={(e)=>setQuery(e.target.value)}/>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map((u) => (
          <UserCard key={u._id} user={u}
            isConnected={connectedIds.has(String(u._id))}
            isPending={pending.some((p)=>String(p.receiver)===String(u._id))}
            onChange={load}/>
        ))}
        {filtered.length === 0 && <p className="text-ink-500">No users match your search.</p>}
      </div>
    </div>
  );
}
