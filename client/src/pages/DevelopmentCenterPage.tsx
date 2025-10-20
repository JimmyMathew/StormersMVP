import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, TrendingUp, Calendar } from "lucide-react";

interface Player {
  id: string;
  name: string;
  teamId: string;
  position?: string;
  jerseyNumber?: number;
}

interface MatchStats {
  points: number;
  assists: number;
  rebounds: number;
}

export default function DevelopmentCenterPage() {
  const [selectedTab, setSelectedTab] = useState("stats");

  const mockPlayerStats = {
    totalGames: 24,
    avgPoints: 12.5,
    avgAssists: 3.2,
    avgRebounds: 4.8,
    winRate: 67,
    recentGames: [
      { id: '1', opponent: 'Team Thunder', points: 15, assists: 4, rebounds: 5, result: 'W' },
      { id: '2', opponent: 'Team Storm', points: 10, assists: 2, rebounds: 6, result: 'L' },
      { id: '3', opponent: 'Team Lightning', points: 18, assists: 5, rebounds: 3, result: 'W' },
      { id: '4', opponent: 'Team Blaze', points: 11, assists: 3, rebounds: 7, result: 'W' },
      { id: '5', opponent: 'Team Frost', points: 14, assists: 4, rebounds: 4, result: 'W' },
    ]
  };

  const skillProgress = [
    { skill: 'Shooting', progress: 75 },
    { skill: 'Passing', progress: 65 },
    { skill: 'Defense', progress: 80 },
    { skill: 'Rebounds', progress: 70 },
    { skill: 'Speed', progress: 85 },
  ];

  const upcomingTraining = [
    { id: '1', date: '2025-11-05', title: 'Shooting Clinic', time: '10:00 AM' },
    { id: '2', date: '2025-11-08', title: 'Defense Workshop', time: '2:00 PM' },
    { id: '3', date: '2025-11-12', title: '1v1 Tournament', time: '4:00 PM' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Development Center</h1>
        <p className="text-muted-foreground">Track your progress and improve your game</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{mockPlayerStats.totalGames}</div>
              <div className="text-sm text-muted-foreground">Games Played</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{mockPlayerStats.avgPoints}</div>
              <div className="text-sm text-muted-foreground">Points/Game</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{mockPlayerStats.winRate}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{upcomingTraining.length}</div>
              <div className="text-sm text-muted-foreground">Training Sessions</div>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="stats">Performance Stats</TabsTrigger>
          <TabsTrigger value="skills">Skill Development</TabsTrigger>
          <TabsTrigger value="training">Training Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Game Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPlayerStats.recentGames.map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold">{game.opponent}</div>
                      <div className="text-sm text-muted-foreground">
                        {game.points} PTS • {game.assists} AST • {game.rebounds} REB
                      </div>
                    </div>
                    <Badge variant={game.result === 'W' ? 'default' : 'secondary'}>
                      {game.result}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {skillProgress.map((skill) => (
                <div key={skill.skill}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{skill.skill}</span>
                    <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Training Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTraining.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{session.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.date).toLocaleDateString()} • {session.time}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Register</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
