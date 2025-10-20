import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Building2, Users, Map, LayoutGrid } from "lucide-react";
import CourtMap from "@/components/CourtMap";
import CourtProfile from "@/components/CourtProfile";

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

export default function CourtsPage() {
  const [cityFilter, setCityFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  const { data: courts = [], isLoading } = useQuery<Court[]>({
    queryKey: ['/api/courts'],
  });

  const filteredCourts = courts.filter(court => {
    const matchesCity = cityFilter === "all" || court.city === cityFilter;
    const matchesUniversity = universityFilter === "all" || court.university === universityFilter;
    const matchesSearch = court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         court.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesUniversity && matchesSearch;
  });

  const cities = Array.from(new Set(courts.map(c => c.city)));
  const universities = Array.from(new Set(courts.map(c => c.university).filter(Boolean)));

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading courts...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Training Hall</h1>
        <p className="text-muted-foreground">Find and book 3x3 basketball courts in Toulouse</p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search courts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={universityFilter} onValueChange={setUniversityFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by university" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              {universities.map(uni => (
                <SelectItem key={uni} value={uni!}>{uni}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
            className="flex-1 md:flex-none"
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Grid View
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            onClick={() => setViewMode('map')}
            className="flex-1 md:flex-none"
          >
            <Map className="w-4 h-4 mr-2" />
            Map View
          </Button>
        </div>
      </div>

      {viewMode === 'map' && (
        <div className="space-y-4">
          <CourtMap 
            courts={filteredCourts} 
            onCourtSelect={setSelectedCourt}
            selectedCourtId={selectedCourt?.id}
          />
          {selectedCourt && (
            <CourtProfile 
              court={selectedCourt}
              onClose={() => setSelectedCourt(null)}
            />
          )}
        </div>
      )}

      {viewMode === 'grid' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court) => (
              <Card 
                key={court.id} 
                className="hover-elevate cursor-pointer transition-all"
                onClick={() => setSelectedCourt(court)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{court.name}</CardTitle>
                    <Badge variant={court.availability === 'available' ? 'default' : 'secondary'}>
                      {court.availability}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div>{court.location}</div>
                      <div className="text-muted-foreground">{court.city}</div>
                    </div>
                  </div>
                  
                  {court.university && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>{court.university}</span>
                    </div>
                  )}

                  {court.contactInfo && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{court.contactInfo}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{court.sponsorVisibility.toLocaleString()} monthly visitors</span>
                  </div>

                  <Button 
                    className="w-full mt-4" 
                    variant={court.availability === 'available' ? 'default' : 'secondary'}
                    disabled={court.availability !== 'available'}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {court.availability === 'available' ? 'Book Court' : 'Currently Booked'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courts found matching your filters</p>
            </div>
          )}

          {selectedCourt && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCourt(null)}>
              <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                <CourtProfile 
                  court={selectedCourt}
                  onClose={() => setSelectedCourt(null)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
