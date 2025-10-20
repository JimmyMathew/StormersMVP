import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { type Tournament } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trophy, Calendar, MapPin, Users, Plus } from 'lucide-react';
import TournamentForm from '@/components/tournaments/TournamentForm';

export default function TournamentsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ['/api/tournaments'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading tournaments...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tournament Management</h1>
          <p className="text-muted-foreground">Create and manage 3x3 basketball tournaments</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-open-create-tournament">
              <Plus className="w-4 h-4 mr-2" />
              Create Tournament
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Tournament</DialogTitle>
            </DialogHeader>
            <TournamentForm onSuccess={() => setCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {tournaments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No tournaments yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first tournament
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} data-testid="button-create-first-tournament">
              <Plus className="w-4 h-4 mr-2" />
              Create Tournament
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
              <Card 
                className="hover-elevate cursor-pointer h-full"
                data-testid={`card-tournament-${tournament.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2" data-testid={`text-tournament-name-${tournament.id}`}>
                      {tournament.name}
                    </CardTitle>
                    <Badge 
                      variant={tournament.status === 'in-progress' ? 'default' : 'secondary'}
                      data-testid={`badge-tournament-status-${tournament.id}`}
                    >
                      {tournament.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{tournament.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(tournament.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Max {tournament.maxTeams} teams</span>
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline">{tournament.format}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
