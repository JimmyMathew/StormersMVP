import OrganizerDashboard from '../OrganizerDashboard';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';

export default function OrganizerDashboardExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Header />
          <OrganizerDashboard />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
