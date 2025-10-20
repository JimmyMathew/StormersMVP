import LoginPage from '../LoginPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function LoginPageExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </ThemeProvider>
  );
}
