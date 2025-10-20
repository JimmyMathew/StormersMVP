import { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Player' | 'Sponsor' | 'Organizer';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  university?: string;
  team?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  selectRole: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const mockUser: AuthUser = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: 'Player',
      university: 'Sample University',
      team: 'Court Kings',
    };
    setUser(mockUser);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
  };

  const loginWithGoogle = async () => {
    const mockUser: AuthUser = {
      id: '2',
      email: 'google.user@example.com',
      name: 'Google User',
      role: 'Player',
      university: 'Tech University',
      team: 'Street Ballers',
    };
    setUser(mockUser);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
  };

  const selectRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        selectRole,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
