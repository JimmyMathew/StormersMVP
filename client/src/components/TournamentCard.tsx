import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';

interface TournamentCardProps {
  id: string;
  name: string;
  location: string;
  date: string;
  teams: number;
  maxTeams: number;
  status: 'upcoming' | 'live' | 'completed';
  onRegister?: () => void;
  onView?: () => void;
}

export default function TournamentCard({
  name,
  location,
  date,
  teams,
  maxTeams,
  status,
  onRegister,
  onView,
}: TournamentCardProps) {
  const statusColors = {
    upcoming: 'bg-muted text-muted-foreground',
    live: 'bg-primary text-primary-foreground',
    completed: 'bg-chart-3 text-white',
  };

  return (
    <Card className="p-4 hover-elevate">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-lg mb-1">{name}</h3>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
          </div>
        </div>
        <Badge className={statusColors[status]}>{status}</Badge>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Users className="w-4 h-4" />
        <span>{teams}/{maxTeams} teams registered</span>
      </div>

      <div className="flex gap-2">
        {status === 'upcoming' && onRegister && (
          <Button onClick={onRegister} className="flex-1" data-testid="button-register">
            Register Team
          </Button>
        )}
        {onView && (
          <Button variant="outline" onClick={onView} className="flex-1" data-testid="button-view">
            View Details
          </Button>
        )}
      </div>
    </Card>
  );
}
