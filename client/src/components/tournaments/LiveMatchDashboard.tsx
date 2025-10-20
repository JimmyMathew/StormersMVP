import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { type Match, type Team, type Player, type MatchStats } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Activity, Trophy, Award } from 'lucide-react';

interface LiveMatchDashboardProps {
  match: Match;
  onUpdate?: () => void;
}

export default function LiveMatchDashboard({ match, onUpdate }: LiveMatchDashboardProps) {
  const { toast } = useToast();
  const [team1Score, setTeam1Score] = useState(match.team1Score);
  const [team2Score, setTeam2Score] = useState(match.team2Score);
  const [selectedMvp, setSelectedMvp] = useState(match.mvpId || '');

  const { data: team1 } = useQuery<Team>({
    queryKey: ['/api/teams', match.team1Id],
  });

  const { data: team2 } = useQuery<Team>({
    queryKey: ['/api/teams', match.team2Id],
  });

  const { data: team1Players = [] } = useQuery<Player[]>({
    queryKey: ['/api/teams', match.team1Id, 'players'],
  });

  const { data: team2Players = [] } = useQuery<Player[]>({
    queryKey: ['/api/teams', match.team2Id, 'players'],
  });

  const { data: matchStats = [] } = useQuery<MatchStats[]>({
    queryKey: ['/api/matches', match.id, 'stats'],
  });

  const allPlayers = [...team1Players, ...team2Players];

  const updateScore = useMutation({
    mutationFn: async () => {
      const winnerId = team1Score > team2Score ? match.team1Id : team2Score > team1Score ? match.team2Id : null;
      return await apiRequest('PATCH', `/api/matches/${match.id}`, {
        team1Score,
        team2Score,
        status: team1Score >= 21 || team2Score >= 21 ? 'completed' : 'in-progress',
        winnerId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tournaments', match.tournamentId, 'matches'] });
      queryClient.invalidateQueries({ queryKey: ['/api/matches', match.id] });
      toast({
        title: 'Score updated',
        description: 'Match score has been updated successfully.',
      });
      onUpdate?.();
    },
  });

  const updateMvp = useMutation({
    mutationFn: async () => {
      return await apiRequest('PATCH', `/api/matches/${match.id}`, {
        mvpId: selectedMvp,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches', match.id] });
      toast({
        title: 'MVP selected',
        description: 'Match MVP has been selected successfully.',
      });
    },
  });

  const updatePlayerStats = useMutation({
    mutationFn: async (data: { playerId: string; points: number; assists: number; rebounds: number }) => {
      const existingStats = matchStats.find(s => s.playerId === data.playerId);
      if (existingStats) {
        return await apiRequest('PATCH', `/api/match-stats/${existingStats.id}`, data);
      } else {
        return await apiRequest('POST', '/api/match-stats', {
          matchId: match.id,
          ...data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches', match.id, 'stats'] });
      toast({
        title: 'Stats updated',
        description: 'Player stats have been updated successfully.',
      });
    },
  });

  const getPlayerStats = (playerId: string) => {
    return matchStats.find(s => s.playerId === playerId) || { points: 0, assists: 0, rebounds: 0 };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live Match Scoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="score" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="score" data-testid="tab-score">Score</TabsTrigger>
            <TabsTrigger value="stats" data-testid="tab-stats">Stats</TabsTrigger>
            <TabsTrigger value="mvp" data-testid="tab-mvp">MVP</TabsTrigger>
          </TabsList>

          <TabsContent value="score" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team1-score">{team1?.name || 'Team 1'}</Label>
                <Input
                  id="team1-score"
                  type="number"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
                  min={0}
                  data-testid="input-team1-score"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team2-score">{team2?.name || 'Team 2'}</Label>
                <Input
                  id="team2-score"
                  type="number"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
                  min={0}
                  data-testid="input-team2-score"
                />
              </div>
            </div>
            <Button
              onClick={() => updateScore.mutate()}
              disabled={updateScore.isPending}
              className="w-full"
              data-testid="button-update-score"
            >
              <Trophy className="w-4 h-4 mr-2" />
              {updateScore.isPending ? 'Updating...' : 'Update Score'}
            </Button>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="space-y-4">
              {allPlayers.map((player) => {
                const stats = getPlayerStats(player.id);
                return (
                  <Card key={player.id} data-testid={`card-player-stats-${player.id}`}>
                    <CardHeader>
                      <CardTitle className="text-base">{player.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Points</Label>
                          <Input
                            type="number"
                            defaultValue={stats.points}
                            min={0}
                            data-testid={`input-player-points-${player.id}`}
                            onBlur={(e) => {
                              updatePlayerStats.mutate({
                                playerId: player.id,
                                points: parseInt(e.target.value) || 0,
                                assists: stats.assists,
                                rebounds: stats.rebounds,
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Assists</Label>
                          <Input
                            type="number"
                            defaultValue={stats.assists}
                            min={0}
                            data-testid={`input-player-assists-${player.id}`}
                            onBlur={(e) => {
                              updatePlayerStats.mutate({
                                playerId: player.id,
                                points: stats.points,
                                assists: parseInt(e.target.value) || 0,
                                rebounds: stats.rebounds,
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Rebounds</Label>
                          <Input
                            type="number"
                            defaultValue={stats.rebounds}
                            min={0}
                            data-testid={`input-player-rebounds-${player.id}`}
                            onBlur={(e) => {
                              updatePlayerStats.mutate({
                                playerId: player.id,
                                points: stats.points,
                                assists: stats.assists,
                                rebounds: parseInt(e.target.value) || 0,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="mvp" className="space-y-4">
            <div className="space-y-2">
              <Label>Select Match MVP</Label>
              <Select onValueChange={setSelectedMvp} defaultValue={selectedMvp}>
                <SelectTrigger data-testid="select-mvp">
                  <SelectValue placeholder="Choose MVP" />
                </SelectTrigger>
                <SelectContent>
                  {allPlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => updateMvp.mutate()}
              disabled={updateMvp.isPending || !selectedMvp}
              className="w-full"
              data-testid="button-select-mvp"
            >
              <Award className="w-4 h-4 mr-2" />
              {updateMvp.isPending ? 'Selecting...' : 'Select MVP'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
