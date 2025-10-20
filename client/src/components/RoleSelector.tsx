import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/contexts/AuthContext';
import { Trophy, Handshake, ClipboardList } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

const roles = [
  {
    role: 'Player' as UserRole,
    icon: Trophy,
    title: 'Player',
    description: 'Register for tournaments, track stats, and connect with teams',
  },
  {
    role: 'Sponsor' as UserRole,
    icon: Handshake,
    title: 'Sponsor',
    description: 'Support tournaments, boost brand visibility, and access analytics',
  },
  {
    role: 'Organizer' as UserRole,
    icon: ClipboardList,
    title: 'Organizer',
    description: 'Create tournaments, manage teams, and coordinate events',
  },
];

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {roles.map(({ role, icon: Icon, title, description }) => (
        <Card
          key={role}
          className="p-6 text-center hover-elevate cursor-pointer"
          onClick={() => onSelectRole(role)}
          data-testid={`card-role-${role.toLowerCase()}`}
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Button className="w-full mt-4" data-testid={`button-select-${role.toLowerCase()}`}>
            Select {title}
          </Button>
        </Card>
      ))}
    </div>
  );
}
