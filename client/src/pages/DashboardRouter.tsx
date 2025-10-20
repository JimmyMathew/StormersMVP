import { useAuth } from '@/contexts/AuthContext';
import PlayerDashboard from './PlayerDashboard';
import SponsorDashboard from './SponsorDashboard';
import OrganizerDashboard from './OrganizerDashboard';

export default function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'Player':
      return <PlayerDashboard />;
    case 'Sponsor':
      return <SponsorDashboard />;
    case 'Organizer':
      return <OrganizerDashboard />;
    default:
      return <PlayerDashboard />;
  }
}
