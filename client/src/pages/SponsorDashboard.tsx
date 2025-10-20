import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/StatCard';
import TournamentCard from '@/components/TournamentCard';
import SponsorInquiryForm from '@/components/SponsorInquiryForm';
import { Eye, TrendingUp, ShoppingBag, Users } from 'lucide-react';

export default function SponsorDashboard() {
  const metrics = [
    { title: 'Total Impressions', value: '45.2K', icon: Eye, trend: { value: 12.5, isPositive: true } },
    { title: 'Engagement Rate', value: '8.4%', icon: TrendingUp, trend: { value: 2.1, isPositive: true } },
    { title: 'Merch Revenue', value: '$12.5K', icon: ShoppingBag, trend: { value: 5.3, isPositive: false } },
    { title: 'Event Attendance', value: '1,234', icon: Users, trend: { value: 18.2, isPositive: true } },
  ];

  const activeTournaments = [
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Sponsor Dashboard</h1>
        <p className="text-muted-foreground">Monitor your brand visibility and engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric) => (
          <StatCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SponsorInquiryForm 
          type="corporate"
          title="Corporate Services"
          description="Inquire about custom sponsorship packages, court branding opportunities, and event partnerships"
        />

        <SponsorInquiryForm 
          type="b2b"
          title="B2B Partnerships"
          description="Connect with our team for business-to-business collaborations and strategic partnerships"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-display font-semibold mb-4">Sponsored Tournaments</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTournaments.map((tournament) => (
          <TournamentCard
            key={tournament.id}
            {...tournament}
            onView={() => console.log('View analytics for', tournament.name)}
          />
        ))}
      </div>
    </div>
  );
}
