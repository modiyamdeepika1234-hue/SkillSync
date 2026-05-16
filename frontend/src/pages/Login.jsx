import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, googleLogin } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await login(form.email, form.password); nav('/dashboard'); }
    catch (e) { toast.error(e.response?.data?.message || 'Login failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <div className="flex justify-center mb-4"><Logo /></div>
        <h1 className="text-xl font-bold text-center">Welcome back</h1>
        <p className="text-sm text-center text-ink-500">Sign in to continue your skill journey.</p>

        <div className="my-5 flex justify-center">
          <GoogleLogin
            onSuccess={async (cred) => {
              try { await googleLogin(cred.credential); nav('/dashboard'); }
              catch { toast.error('Google login failed'); }
            }}
            onError={() => toast.error('Google login failed')}
          />
        </div>

        <div className="flex items-center gap-3 my-4 text-xs text-ink-500">
          <div className="h-px bg-slate-200 flex-1"/> OR <div className="h-px bg-slate-200 flex-1"/>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input className="input" type="email" placeholder="Email" required
            value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
          <input className="input" type="password" placeholder="Password" required
            value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
          <button className="btn-primary w-full" disabled={busy}>{busy?'Signing in…':'Sign in'}</button>
        </form>

        <p className="mt-4 text-sm text-center text-ink-500">
          New here? <Link to="/register" className="text-brand-700 font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
