import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, LogOut, Trophy, LayoutDashboard, Store, MapPin, Film, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import ThemeToggle from './ThemeToggle';
import { Link, useLocation } from 'wouter';
import logoUrl from '@assets/logowhite_1760998128625.png';

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [location] = useLocation();

  if (!user) return null;

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tournaments', label: 'Tournaments', icon: Trophy },
    { href: '/courts', label: 'Courts', icon: MapPin },
    ...(user.role === 'Player' ? [{ href: '/development', label: 'Training', icon: TrendingUp }] : []),
    { href: '/media', label: 'Media', icon: Film },
    ...(user.role !== 'Organizer' ? [{ href: '/shop', label: 'Shop', icon: Store }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <img 
              src={logoUrl} 
              alt="Stormers360 - Toulouse 3x3 Basketball" 
              className="h-10 w-auto"
              style={{ filter: 'invert(1)' }}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className="gap-2"
                    data-testid={`nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="hidden sm:flex" data-testid="badge-user-role">
            {user.role}
          </Badge>
          {user.role !== 'Organizer' && (
            <Link href="/shop">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          )}
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={logout} data-testid="button-logout">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
