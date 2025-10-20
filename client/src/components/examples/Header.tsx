import Header from '../Header';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Header />
          <div className="p-8">
            <p className="text-muted-foreground">Header appears at the top when logged in</p>
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
