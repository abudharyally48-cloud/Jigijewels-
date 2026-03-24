import { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, verifyToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jigi_admin_token');
    if (token) {
      verifyToken()
        .then(r => setAdmin(r.data.admin))
        .catch(() => localStorage.removeItem('jigi_admin_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const { data } = await adminLogin({ username, password });
    localStorage.setItem('jigi_admin_token', data.token);
    setAdmin({ username: data.username });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('jigi_admin_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
