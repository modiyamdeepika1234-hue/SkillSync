// Real-time chat. Lists accepted connections, opens conversation with chosen one.
import { useEffect, useRef, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Send, Circle } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const { socket, online } = useSocket();
  const [contacts, setContacts] = useState([]);
  const [active, setActive]     = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    api.get('/connections').then(({ data }) => {
      const list = data.map((c) => c.requester._id === user._id ? c.receiver : c.requester);
      setContacts(list);
    });
  }, [user]);

  useEffect(() => {
    if (!active) return;
    api.get(`/messages/${active._id}`).then((r) => setMessages(r.data));
  }, [active]);

  useEffect(() => {
    if (!socket) return;
    const onNew = (m) => {
      if (!active) return;
      const involved = [m.sender, m.receiver].map(String);
      if (involved.includes(String(active._id)) && involved.includes(String(user._id))) {
        setMessages((prev) => [...prev, m]);
      }
    };
    socket.on('message:new', onNew);
    return () => socket.off('message:new', onNew);
  }, [socket, active, user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket || !active) return;
    socket.emit('message:send', { to: active._id, text }, (ack) => {
      if (ack?.error) alert(ack.error);
    });
    setText('');
  };

  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-4 h-[calc(100vh-6rem)]">
      <aside className="card overflow-y-auto p-2">
        <h2 className="px-3 py-2 font-semibold">Connections</h2>
        {contacts.length === 0 && <p className="px-3 text-sm text-ink-500">No connections yet — send a request first.</p>}
        {contacts.map((c) => {
          const isOnline = online.includes(String(c._id));
          return (
            <button key={c._id} onClick={() => setActive(c)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${active?._id===c._id?'bg-brand-50':'hover:bg-slate-50'}`}>
              <img src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
                   className="w-9 h-9 rounded-full bg-slate-200" alt=""/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-ink-500 flex items-center gap-1">
                  <Circle size={8} className={isOnline?'fill-emerald-500 text-emerald-500':'fill-slate-300 text-slate-300'}/>
                  {isOnline?'Online':'Offline'}
                </p>
              </div>
            </button>
          );
        })}
      </aside>

      <section className="card flex flex-col">
        {!active ? (
          <div className="m-auto text-ink-500">Select a connection to start chatting.</div>
        ) : (
          <>
            <header className="border-b pb-3 mb-3 font-semibold">{active.name}</header>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {messages.map((m) => {
                const mine = String(m.sender) === String(user._id);
                return (
                  <div key={m._id} className={`flex ${mine?'justify-end':'justify-start'}`}>
                    <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${mine?'bg-brand-600 text-white':'bg-slate-100 text-ink-900'}`}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef}/>
            </div>
            <form onSubmit={send} className="flex gap-2 mt-3">
              <input className="input flex-1" placeholder="Type a message…"
                value={text} onChange={(e)=>setText(e.target.value)}/>
              <button className="btn-primary"><Send size={16}/></button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
