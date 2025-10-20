import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Phone, Building2, Users, Calendar, Eye, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Court {
  id: string;
  name: string;
  location: string;
  university: string | null;
  city: string;
  latitude: string | null;
  longitude: string | null;
  availability: string;
  contactInfo: string | null;
  sponsorVisibility: number;
}

interface VisibilityLog {
  date: string;
  views: number;
  uniqueVisitors: number;
}

interface CourtProfileProps {
  court: Court;
  onClose?: () => void;
}

export default function CourtProfile({ court, onClose }: CourtProfileProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'analytics'>('details');

  const { data: visibilityData = [] } = useQuery<VisibilityLog[]>({
    queryKey: [`/api/courts/${court.id}/visibility-logs`],
    enabled: activeTab === 'analytics',
  });

  const totalViews = visibilityData.reduce((sum, log) => sum + log.views, 0);
  const avgDailyViews = visibilityData.length > 0 ? Math.round(totalViews / visibilityData.length) : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{court.name}</CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={court.availability === 'available' ? 'default' : 'secondary'}>
                  {court.availability}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {court.sponsorVisibility.toLocaleString()} monthly visitors
                </span>
              </div>
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4 border-b">
          <Button
            variant={activeTab === 'details' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('details')}
          >
            Details
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </Button>
        </div>

        {activeTab === 'details' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Location</h3>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <div>
                  <p>{court.location}</p>
                  <p className="text-sm text-muted-foreground">{court.city}</p>
                  {court.latitude && court.longitude && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {parseFloat(court.latitude).toFixed(4)}, {parseFloat(court.longitude).toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {court.university && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">University</h3>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>{court.university}</span>
                </div>
              </div>
            )}

            {court.contactInfo && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Contact Information</h3>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{court.contactInfo}</span>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Availability Status</h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="capitalize">{court.availability}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">Sponsor Visibility Metrics</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">Monthly Visitors</span>
                  </div>
                  <span className="font-semibold">{court.sponsorVisibility.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-sm">Sponsor Impressions</span>
                  </div>
                  <span className="font-semibold">{(court.sponsorVisibility * 1.5).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1"
                disabled={court.availability !== 'available'}
              >
                {court.availability === 'available' ? 'Book Court' : 'Currently Unavailable'}
              </Button>
              <Button variant="outline" className="flex-1">
                Get Directions
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Total Views (30 days)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold">{totalViews}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Avg. Daily Views</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-bold">{avgDailyViews}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {visibilityData.length > 0 ? (
                  visibilityData.slice(0, 7).map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">{new Date(log.date).toLocaleDateString()}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-muted-foreground">{log.views} views</span>
                        <span className="text-muted-foreground">{log.uniqueVisitors} visitors</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No analytics data available yet
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-sm mb-2">Sponsor Visibility Score</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((court.sponsorVisibility / 5000) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{Math.min(Math.round((court.sponsorVisibility / 5000) * 100), 100)}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on monthly visitor traffic and engagement metrics
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
