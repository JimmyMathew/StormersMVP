import SponsorDashboard from '../SponsorDashboard';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';

export default function SponsorDashboardExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Header />
          <SponsorDashboard />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
