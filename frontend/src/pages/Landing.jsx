import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Sparkles, Users, MessageSquare } from 'lucide-react';
export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Logo />
        <div className="flex gap-2">
          <Link to="/login" className="btn-ghost">Login</Link>
          <Link to="/register" className="btn-primary">Get started</Link>
        </div>
      </header>
      <section className="max-w-4xl mx-auto text-center px-6 py-16">
        <h1 className="text-5xl font-bold tracking-tight">Swap skills. <span className="text-brand-600">Grow together.</span></h1>
        <p className="mt-5 text-lg text-ink-700">
          SkillSync connects students who want to teach what they know and learn what they don't.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register" className="btn-primary">Join free</Link>
          <Link to="/login" className="btn-outline">I have an account</Link>
        </div>
      </section>
      <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4 px-6 pb-20">
        {[
          [Sparkles, 'Smart matches', 'Find peers whose skills complement yours.'],
          [Users, 'Connection requests', 'Send & accept requests, just like Instagram.'],
          [MessageSquare, 'Real-time chat', 'Talk live once you both connect.'],
        ].map(([Icon, t, d]) => (
          <div key={t} className="card text-center">
            <Icon className="mx-auto text-brand-600" size={28}/>
            <h3 className="mt-3 font-semibold">{t}</h3>
            <p className="text-sm text-ink-500 mt-1">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
