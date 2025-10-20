import PlayerDashboard from '../PlayerDashboard';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';

export default function PlayerDashboardExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Header />
          <PlayerDashboard />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
