import { useEffect, useState } from 'react';
import api from '../api/client';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Community() {
  const [posts, setPosts]   = useState([]);
  const [text, setText]     = useState('');

  const load = () => api.get('/posts').then((r)=>setPosts(r.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault(); if (!text.trim()) return;
    try { await api.post('/posts', { content: text }); setText(''); load(); }
    catch { toast.error('Could not post'); }
  };

  const like = async (id) => { await api.post(`/posts/${id}/like`); load(); };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Community</h1>
      <form onSubmit={create} className="card mt-4">
        <textarea className="input" rows="3" placeholder="Share an idea, win, or question…"
          value={text} onChange={(e)=>setText(e.target.value)}/>
        <button className="btn-primary mt-3">Post</button>
      </form>
      <div className="mt-6 space-y-3">
        {posts.map((p) => (
          <div key={p._id} className="card">
            <div className="flex items-center gap-3">
              <img src={p.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${p.author.name}`}
                   className="w-9 h-9 rounded-full bg-slate-200" alt=""/>
              <div>
                <p className="font-semibold text-sm">{p.author.name}</p>
                <p className="text-xs text-ink-500">{new Date(p.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap">{p.content}</p>
            <button onClick={() => like(p._id)} className="mt-3 text-sm text-ink-500 hover:text-brand-600 flex items-center gap-1">
              <Heart size={16}/> {p.likes.length}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
