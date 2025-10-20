import { useState } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { type Tournament, type Team, type Match } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trophy, Users, Activity, ChevronLeft, Plus } from 'lucide-react';
import { Link } from 'wouter';
import TournamentForm from '@/components/tournaments/TournamentForm';
import TeamRegistrationForm from '@/components/tournaments/TeamRegistrationForm';
import PlayerRegistrationForm from '@/components/tournaments/PlayerRegistrationForm';
import BracketGenerator from '@/components/tournaments/BracketGenerator';
import LiveMatchDashboard from '@/components/tournaments/LiveMatchDashboard';

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [selectedTeamForPlayers, setSelectedTeamForPlayers] = useState<string | null>(null);
  const [selectedMatchForScoring, setSelectedMatchForScoring] = useState<Match | null>(null);

  const { data: tournament, isLoading: tournamentLoading } = useQuery<Tournament>({
    queryKey: ['/api/tournaments', id],
  });

  const { data: teams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ['/api/tournaments', id, 'teams'],
    enabled: !!tournament,
  });

  const { data: matches = [] } = useQuery<Match[]>({
    queryKey: ['/api/tournaments', id, 'matches'],
    enabled: !!tournament,
  });

  if (tournamentLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading tournament...</div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Tournament not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tournaments">
          <Button variant="ghost" size="icon" data-testid="button-back-to-tournaments">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold" data-testid="text-tournament-name">
              {tournament.name}
            </h1>
            <Badge variant={tournament.status === 'in-progress' ? 'default' : 'secondary'}>
              {tournament.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {tournament.location} • {new Date(tournament.date).toLocaleDateString()} • {tournament.format}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="teams" data-testid="tab-teams">Teams ({teams.length})</TabsTrigger>
          <TabsTrigger value="bracket" data-testid="tab-bracket">Bracket</TabsTrigger>
          <TabsTrigger value="live" data-testid="tab-live">Live Scoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="text-total-teams">
                  {teams.length} / {tournament.maxTeams}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="text-total-matches">
                  {matches.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="text-completed-matches">
                  {matches.filter(m => m.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-open-register-team">
                  <Plus className="w-4 h-4 mr-2" />
                  Register Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register Team</DialogTitle>
                </DialogHeader>
                <TeamRegistrationForm
                  tournamentId={tournament.id}
                  onSuccess={() => setTeamDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {teamsLoading ? (
            <div className="text-center p-8">Loading teams...</div>
          ) : teams.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No teams registered</h3>
                <p className="text-muted-foreground mb-4">
                  Register teams to participate in this tournament
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.id} data-testid={`card-team-${team.id}`}>
                  <CardHeader>
                    <CardTitle data-testid={`text-team-name-${team.id}`}>{team.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {team.university && (
                      <p className="text-sm text-muted-foreground">{team.university}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600 dark:text-green-400">
                        {team.wins}W
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        {team.losses}L
                      </span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => setSelectedTeamForPlayers(team.id)}
                          data-testid={`button-add-players-${team.id}`}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Players
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Player to {team.name}</DialogTitle>
                        </DialogHeader>
                        {selectedTeamForPlayers && (
                          <PlayerRegistrationForm teamId={selectedTeamForPlayers} />
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bracket" className="space-y-6">
          <BracketGenerator tournament={tournament} />
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          {matches.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No matches scheduled</h3>
                <p className="text-muted-foreground">
                  Generate the tournament bracket to create matches
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches
                  .filter(m => m.status !== 'completed')
                  .map((match) => (
                    <Card
                      key={match.id}
                      className="hover-elevate cursor-pointer"
                      onClick={() => setSelectedMatchForScoring(match)}
                      data-testid={`card-live-match-${match.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">{match.round}</span>
                          <Badge variant="outline">{match.status}</Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {teams.find(t => t.id === match.team1Id)?.name || 'Team 1'}
                            </span>
                            <span className="text-lg font-bold">{match.team1Score}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {teams.find(t => t.id === match.team2Id)?.name || 'Team 2'}
                            </span>
                            <span className="text-lg font-bold">{match.team2Score}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {selectedMatchForScoring && (
                <Dialog
                  open={!!selectedMatchForScoring}
                  onOpenChange={(open) => !open && setSelectedMatchForScoring(null)}
                >
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Live Match Scoring</DialogTitle>
                    </DialogHeader>
                    <LiveMatchDashboard
                      match={selectedMatchForScoring}
                      onUpdate={() => setSelectedMatchForScoring(null)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
