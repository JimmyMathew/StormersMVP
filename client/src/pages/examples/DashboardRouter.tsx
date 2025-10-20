import DashboardRouter from '../DashboardRouter';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';

export default function DashboardRouterExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Header />
          <DashboardRouter />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
