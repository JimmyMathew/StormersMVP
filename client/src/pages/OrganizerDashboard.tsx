import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/StatCard';
import TournamentCard from '@/components/TournamentCard';
import { Trophy, Users, Calendar, Plus } from 'lucide-react';

export default function OrganizerDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = [
    { title: 'Total Tournaments', value: '24', icon: Trophy },
    { title: 'Active Players', value: '456', icon: Users },
    { title: 'Upcoming Events', value: '8', icon: Calendar },
  ];

  const tournaments = [
    {
      id: '1',
      name: 'Summer Slam 2025',
      location: 'Downtown Courts',
      date: 'June 15, 2025',
      teams: 12,
      maxTeams: 16,
      status: 'upcoming' as const,
    },
    {
      id: '2',
      name: 'University Challenge',
      location: 'Campus Recreation Center',
      date: 'July 1, 2025',
      teams: 8,
      maxTeams: 8,
      status: 'live' as const,
    },
    {
      id: '3',
      name: 'Spring Invitational',
      location: 'City Park Courts',
      date: 'May 20, 2025',
      teams: 16,
      maxTeams: 16,
      status: 'completed' as const,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Organizer Dashboard</h1>
          <p className="text-muted-foreground">Manage tournaments and coordinate events</p>
        </div>
        <Button className="gap-2" data-testid="button-create-tournament">
          <Plus className="w-4 h-4" />
          Create Tournament
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="live" data-testid="tab-live">Live Matches</TabsTrigger>
          <TabsTrigger value="brackets" data-testid="tab-brackets">Brackets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                {...tournament}
                onView={() => console.log('Manage', tournament.name)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-display font-semibold text-lg mb-4">Live Match Scoring</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                <div>
                  <p className="font-semibold">Court Kings vs Street Ballers</p>
                  <p className="text-sm text-muted-foreground">Court A - Q3</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono font-bold">15 - 12</p>
                </div>
              </div>
              <Button className="w-full" data-testid="button-update-score">Update Score</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="brackets" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-display font-semibold text-lg mb-4">Tournament Brackets</h3>
            <p className="text-muted-foreground mb-4">Generate and manage tournament brackets</p>
            <Button variant="outline" className="w-full" data-testid="button-generate-bracket">
              Generate Bracket
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
