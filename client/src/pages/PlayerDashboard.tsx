import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/StatCard';
import TournamentCard from '@/components/TournamentCard';
import { Trophy, Target, TrendingUp, Calendar, MapPin, Users } from 'lucide-react';

export default function PlayerDashboard() {
  const [selectedTab, setSelectedTab] = useState('tournaments');

  const upcomingTournaments = [
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
  ];

  const myStats = [
    { label: 'Points Per Game', value: '12.5', icon: Target },
    { label: 'Games Played', value: '24', icon: Trophy },
    { label: 'Win Rate', value: '67%', icon: TrendingUp },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Player Dashboard</h1>
        <p className="text-muted-foreground">Track your performance and upcoming tournaments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {myStats.map((stat) => (
          <StatCard
            key={stat.label}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tournaments" data-testid="tab-tournaments">Tournaments</TabsTrigger>
          <TabsTrigger value="courts" data-testid="tab-courts">Courts</TabsTrigger>
          <TabsTrigger value="team" data-testid="tab-team">My Team</TabsTrigger>
        </TabsList>

        <TabsContent value="tournaments" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold">Upcoming Tournaments</h2>
            <Link href="/tournaments">
              <Button variant="outline" data-testid="button-view-all">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                {...tournament}
                onRegister={() => console.log('Register for', tournament.name)}
                onView={() => console.log('View', tournament.name)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Downtown Courts', 'University Recreation', 'City Park'].map((court) => (
              <Card key={court} className="p-4 hover-elevate">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{court}</h3>
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">Available today</p>
                <Button variant="outline" className="w-full" data-testid={`button-view-${court.toLowerCase().replace(/\s+/g, '-')}`}>
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-display font-semibold text-lg mb-4">Court Kings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Team Record</span>
                <span className="font-semibold">16-8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ranking</span>
                <span className="font-semibold">#4 in Division</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Members</span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">4 players</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" data-testid="button-manage-team">Manage Team</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
