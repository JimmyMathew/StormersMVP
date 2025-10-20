import MerchShop from '../MerchShop';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';

export default function MerchShopExample() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Header />
          <MerchShop />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
