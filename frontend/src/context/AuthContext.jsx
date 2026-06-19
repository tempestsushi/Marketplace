// AuthContext — provides user auth state and helpers to the entire app
import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { authGoogle, authGoogleWithPassword, authLogin, authLogout, authMe, authRegister } from '../api/authClient';
import { updateMyProfile } from '../api/profileClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const refreshSessionUser = useCallback(async () => {
    const resp = await authMe();
    if (resp.user) {
      setCurrentUser(resp.user);
      setIsLoggedIn(true);
      return resp.user;
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
    return null;
  }, []);

  // Restore session from server cookie on first load
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingAuth(true);
      try {
        const resp = await authMe();
        if (!alive) return;
        if (resp.user) {
          setCurrentUser(resp.user);
          setIsLoggedIn(true);
        } else {
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      } catch {
        if (!alive) return;
        setCurrentUser(null);
        setIsLoggedIn(false);
      } finally {
        if (alive) setLoadingAuth(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  async function loginWithGoogle(idToken) {
    const resp = await authGoogle(idToken);
    if (resp?.requiresPasswordSetup) {
      return { requiresPasswordSetup: true, email: resp.email, suggestedName: resp.suggestedName };
    }
    const user = await refreshSessionUser();
    return { user: user || resp.user, requiresPasswordSetup: false };
  }

  async function completeGooglePasswordSetup(idToken, password) {
    const resp = await authGoogleWithPassword(idToken, password);
    if (resp?.requiresPasswordSetup) return { requiresPasswordSetup: true, email: resp.email };
    const user = await refreshSessionUser();
    return { user: user || resp.user, requiresPasswordSetup: false };
  }

  async function loginWithPassword(email, password) {
    const resp = await authLogin({ email, password });
    return refreshSessionUser().catch(() => {
      setCurrentUser(resp.user);
      setIsLoggedIn(true);
      return resp.user;
    });
  }

  async function registerWithPassword(payload) {
    const resp = await authRegister(payload);
    return refreshSessionUser().catch(() => {
      setCurrentUser(resp.user);
      setIsLoggedIn(true);
      return resp.user;
    });
  }

  async function logout() {
    try {
      await authLogout();
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
  }

  async function saveProfile(patch) {
    const resp = await updateMyProfile(patch);
    setCurrentUser(resp.user);
    setIsLoggedIn(true);
    return resp.user;
  }

  const value = useMemo(() => ({
    currentUser,
    isLoggedIn,
    loadingAuth,
    refreshSessionUser,
    loginWithGoogle,
    completeGooglePasswordSetup,
    loginWithPassword,
    registerWithPassword,
    logout,
    saveProfile,
  }), [currentUser, isLoggedIn, loadingAuth, refreshSessionUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access to auth context
export function useAuth() {
  return useContext(AuthContext);
}
