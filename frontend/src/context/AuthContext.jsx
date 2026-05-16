// Auth state: token + user, login/register/google/logout.
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillsync_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => { localStorage.removeItem('skillsync_token'); setToken(null); })
      .finally(() => setLoading(false));
  }, [token]);

  const persist = ({ token, user }) => {
    localStorage.setItem('skillsync_token', token);
    setToken(token); setUser(user);
  };

  const login    = async (email, password)        => persist((await api.post('/auth/login',   { email, password })).data);
  const register = async (name, email, password)  => persist((await api.post('/auth/register',{ name, email, password })).data);
  const googleLogin = async (credential)          => persist((await api.post('/auth/google',  { credential })).data);
  const logout = () => { localStorage.removeItem('skillsync_token'); setToken(null); setUser(null); };

  return (
    <AuthCtx.Provider value={{ user, setUser, token, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
