import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { SiGoogle } from 'react-icons/si';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import RoleSelector from '@/components/RoleSelector';
import logoUrl from '@assets/logowhite_1760998128625.png';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, loginWithGoogle, selectRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    setShowRoleSelector(true);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    setShowRoleSelector(true);
  };

  const handleRoleSelect = (role: 'Player' | 'Sponsor' | 'Organizer') => {
    selectRole(role);
    setShowRoleSelector(false);
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-chart-2/20 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={logoUrl} 
              alt="Stormers360 - Toulouse 3x3 Basketball" 
              className="h-24 w-auto"
              style={{ filter: 'invert(1)' }}
            />
          </div>
          <h1 className="font-display font-bold text-3xl mb-2">Welcome to Stormers360</h1>
          <p className="text-muted-foreground">Sign in to manage your 3x3 basketball experience</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="input-password"
            />
          </div>
          <Button type="submit" className="w-full" data-testid="button-login">
            Sign In
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleGoogleLogin}
          data-testid="button-google-login"
        >
          <SiGoogle className="w-4 h-4" />
          Sign in with Google
        </Button>
      </Card>

      <Dialog open={showRoleSelector} onOpenChange={setShowRoleSelector}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Choose Your Role</DialogTitle>
            <DialogDescription>
              Select how you want to use the platform. You can change this later.
            </DialogDescription>
          </DialogHeader>
          <RoleSelector onSelectRole={handleRoleSelect} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
