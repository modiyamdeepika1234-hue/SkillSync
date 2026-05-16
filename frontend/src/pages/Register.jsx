import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, googleLogin } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await register(form.name, form.email, form.password); nav('/dashboard'); }
    catch (e) { toast.error(e.response?.data?.message || 'Sign up failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <div className="flex justify-center mb-4"><Logo /></div>
        <h1 className="text-xl font-bold text-center">Create your account</h1>

        <div className="my-5 flex justify-center">
          <GoogleLogin
            onSuccess={async (cred) => {
              try { await googleLogin(cred.credential); nav('/dashboard'); }
              catch { toast.error('Google sign up failed'); }
            }}
            onError={() => toast.error('Google sign up failed')}
            text="signup_with"
          />
        </div>

        <div className="flex items-center gap-3 my-4 text-xs text-ink-500">
          <div className="h-px bg-slate-200 flex-1"/> OR <div className="h-px bg-slate-200 flex-1"/>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input className="input" placeholder="Full name" required
            value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
          <input className="input" type="email" placeholder="Email" required
            value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
          <input className="input" type="password" placeholder="Password (min 6 chars)" minLength={6} required
            value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
          <button className="btn-primary w-full" disabled={busy}>{busy?'Creating…':'Create account'}</button>
        </form>

        <p className="mt-4 text-sm text-center text-ink-500">
          Already have an account? <Link to="/login" className="text-brand-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
