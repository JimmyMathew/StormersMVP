import TournamentCard from '../TournamentCard';

export default function TournamentCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <TournamentCard
        id="1"
        name="Summer Slam 2025"
        location="Downtown Courts"
        date="June 15, 2025"
        teams={12}
        maxTeams={16}
        status="upcoming"
        onRegister={() => console.log('Register clicked')}
        onView={() => console.log('View clicked')}
      />
      <TournamentCard
        id="2"
        name="University Challenge"
        location="Campus Recreation Center"
        date="July 1, 2025"
        teams={8}
        maxTeams={8}
        status="live"
        onView={() => console.log('View clicked')}
      />
      <TournamentCard
        id="3"
        name="Spring Invitational"
        location="City Park Courts"
        date="May 20, 2025"
        teams={16}
        maxTeams={16}
        status="completed"
        onView={() => console.log('View clicked')}
      />
    </div>
  );
}
