import { useQuery, useMutation } from '@tanstack/react-query';
import { type Tournament, type Team, type Match } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BracketGeneratorProps {
  tournament: Tournament;
}

export default function BracketGenerator({ tournament }: BracketGeneratorProps) {
  const { toast } = useToast();

  const { data: teams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ['/api/tournaments', tournament.id, 'teams'],
  });

  const { data: matches = [], isLoading: matchesLoading } = useQuery<Match[]>({
    queryKey: ['/api/tournaments', tournament.id, 'matches'],
  });

  const generateBracket = useMutation({
    mutationFn: async () => {
      const sortedTeams = [...teams].sort(() => Math.random() - 0.5);
      const rounds = Math.ceil(Math.log2(sortedTeams.length));
      const matchesPerRound: Record<number, number> = {};
      
      for (let round = 1; round <= rounds; round++) {
        matchesPerRound[round] = Math.pow(2, rounds - round);
      }

      const newMatches: Match[] = [];
      
      for (let i = 0; i < sortedTeams.length; i += 2) {
        if (i + 1 < sortedTeams.length) {
          const response = await apiRequest('POST', '/api/matches', {
            tournamentId: tournament.id,
            team1Id: sortedTeams[i].id,
            team2Id: sortedTeams[i + 1].id,
            round: 'Round 1',
            status: 'scheduled',
            courtNumber: `Court ${Math.floor(i / 2) + 1}`,
          });
          const match = await response.json();
          newMatches.push(match);
        }
      }

      return newMatches;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tournaments', tournament.id, 'matches'] });
      toast({
        title: 'Bracket generated',
        description: 'Tournament bracket has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to generate bracket. Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (teamsLoading || matchesLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const groupByRound = (matches: Match[]): Record<string, Match[]> => {
    return matches.reduce((acc, match) => {
      if (!acc[match.round]) {
        acc[match.round] = [];
      }
      acc[match.round].push(match);
      return acc;
    }, {} as Record<string, Match[]>);
  };

  const matchesByRound = groupByRound(matches);
  const rounds = Object.keys(matchesByRound).sort();

  const getTeamName = (teamId: string) => {
    return teams.find(t => t.id === teamId)?.name || 'TBD';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Tournament Bracket
          </CardTitle>
          {matches.length === 0 && teams.length >= 2 && (
            <Button
              onClick={() => generateBracket.mutate()}
              disabled={generateBracket.isPending}
              data-testid="button-generate-bracket"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {generateBracket.isPending ? 'Generating...' : 'Generate Bracket'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            {teams.length < 2 ? (
              <p>Need at least 2 teams to generate bracket</p>
            ) : (
              <p>Click "Generate Bracket" to create the tournament structure</p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {rounds.map((round, roundIndex) => (
              <div key={round} className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {round}
                  <Badge variant="secondary" data-testid={`text-round-${roundIndex + 1}`}>
                    {matchesByRound[round].length} {matchesByRound[round].length === 1 ? 'Match' : 'Matches'}
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchesByRound[round].map((match) => (
                    <Card 
                      key={match.id} 
                      className="hover-elevate"
                      data-testid={`card-match-${match.id}`}
                    >
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{match.courtNumber}</span>
                          <Badge 
                            variant={match.status === 'completed' ? 'default' : 'outline'}
                            data-testid={`badge-match-status-${match.id}`}
                          >
                            {match.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className={`flex items-center justify-between p-2 rounded ${match.winnerId === match.team1Id ? 'bg-primary/10' : ''}`}>
                            <span 
                              className="font-medium"
                              data-testid={`text-team1-${match.id}`}
                            >
                              {getTeamName(match.team1Id)}
                            </span>
                            <span 
                              className="text-lg font-bold"
                              data-testid={`text-team1-score-${match.id}`}
                            >
                              {match.team1Score}
                            </span>
                          </div>
                          <div className={`flex items-center justify-between p-2 rounded ${match.winnerId === match.team2Id ? 'bg-primary/10' : ''}`}>
                            <span 
                              className="font-medium"
                              data-testid={`text-team2-${match.id}`}
                            >
                              {getTeamName(match.team2Id)}
                            </span>
                            <span 
                              className="text-lg font-bold"
                              data-testid={`text-team2-score-${match.id}`}
                            >
                              {match.team2Score}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
