import StatCard from '../StatCard';
import { Users, Trophy, ShoppingBag } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <StatCard
        title="Total Players"
        value="1,234"
        icon={Users}
        trend={{ value: 12.5, isPositive: true }}
      />
      <StatCard
        title="Active Tournaments"
        value="24"
        icon={Trophy}
        trend={{ value: 8.2, isPositive: true }}
      />
      <StatCard
        title="Merch Sales"
        value="$12.5K"
        icon={ShoppingBag}
        trend={{ value: 3.1, isPositive: false }}
      />
    </div>
  );
}
