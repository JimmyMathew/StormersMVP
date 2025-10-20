import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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

interface CourtMapProps {
  courts: Court[];
  onCourtSelect?: (court: Court) => void;
  selectedCourtId?: string;
}

const courtIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapBounds({ courts }: { courts: Court[] }) {
  const map = useMap();

  useEffect(() => {
    if (courts.length > 0) {
      const validCourts = courts.filter(c => c.latitude && c.longitude);
      if (validCourts.length > 0) {
        const bounds = new LatLngBounds(
          validCourts.map(c => [parseFloat(c.latitude!), parseFloat(c.longitude!)])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [courts, map]);

  return null;
}

export default function CourtMap({ courts, onCourtSelect, selectedCourtId }: CourtMapProps) {
  const defaultCenter: [number, number] = [43.6047, 1.4442];
  
  const courtsWithCoordinates = courts.filter(
    court => court.latitude && court.longitude
  );

  if (courtsWithCoordinates.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No courts with location data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] rounded-lg overflow-hidden border">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds courts={courtsWithCoordinates} />
        {courtsWithCoordinates.map((court) => (
          <Marker
            key={court.id}
            position={[parseFloat(court.latitude!), parseFloat(court.longitude!)]}
            icon={courtIcon}
            eventHandlers={{
              click: () => onCourtSelect?.(court),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <h3 className="font-semibold text-lg mb-2">{court.name}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p>{court.location}</p>
                    <p className="text-xs text-muted-foreground">{court.city}</p>
                  </div>
                  {court.university && (
                    <div>
                      <p className="text-muted-foreground">University</p>
                      <p>{court.university}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Availability</p>
                    <Badge variant={court.availability === 'available' ? 'default' : 'secondary'}>
                      {court.availability}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Visitors</p>
                    <p className="font-semibold">{court.sponsorVisibility.toLocaleString()}</p>
                  </div>
                  {court.contactInfo && (
                    <div>
                      <p className="text-muted-foreground">Contact</p>
                      <p>{court.contactInfo}</p>
                    </div>
                  )}
                </div>
                <Button 
                  className="w-full mt-3" 
                  size="sm"
                  variant={court.availability === 'available' ? 'default' : 'secondary'}
                  disabled={court.availability !== 'available'}
                  onClick={() => onCourtSelect?.(court)}
                >
                  {court.availability === 'available' ? 'View Details' : 'Currently Booked'}
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
