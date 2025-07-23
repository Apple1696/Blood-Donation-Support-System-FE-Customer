import React from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, User } from 'lucide-react';
import type { CustomerProfile } from '@/services/ProfileService';

interface DonorMapProps {
  donors: CustomerProfile[];
  apiKey: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const DonorMap: React.FC<DonorMapProps> = ({ 
  donors, 
  apiKey, 
  center = { lat: 10.8231, lng: 106.6297 }, // Default to Ho Chi Minh City
  zoom = 10 
}) => {
  const [selectedDonor, setSelectedDonor] = React.useState<CustomerProfile | null>(null);

  // Get blood type color
  const getBloodTypeColor = (group: string, rh: string) => {
    const colors = {
      'A': 'bg-red-100 text-red-800',
      'B': 'bg-blue-100 text-blue-800',
      'AB': 'bg-purple-100 text-purple-800',
      'O': 'bg-green-100 text-green-800'
    };
    return colors[group as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Format last donation date
  const formatLastDonation = (date: string | null) => {
    if (!date) return 'Chưa từng hiến máu';

    const donationDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - donationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} ngày trước`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng trước`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} năm trước`;
    }
  };

  // Check if user can donate soon (90+ days since last donation)
  const canDonateSoon = (lastDonationDate: string | null) => {
    if (!lastDonationDate) return true;
    const donationDate = new Date(lastDonationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - donationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 90;
  };

  // Calculate center point from donors if not provided
  const calculateCenter = () => {
    if (donors.length === 0) return center;
    
    const validDonors = donors.filter(donor => 
      donor.latitude && donor.longitude && 
      !isNaN(parseFloat(donor.latitude)) && 
      !isNaN(parseFloat(donor.longitude))
    );
    
    if (validDonors.length === 0) return center;

    const avgLat = validDonors.reduce((sum, donor) => sum + parseFloat(donor.latitude), 0) / validDonors.length;
    const avgLng = validDonors.reduce((sum, donor) => sum + parseFloat(donor.longitude), 0) / validDonors.length;
    
    return { lat: avgLat, lng: avgLng };
  };

  const mapCenter = calculateCenter();

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden border">
      <APIProvider apiKey={apiKey}>
        <Map
          center={mapCenter}
          zoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="donor-map"
        >
          {donors.map((donor) => {
            const lat = parseFloat(donor.latitude);
            const lng = parseFloat(donor.longitude);
            
            // Skip donors without valid coordinates
            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker
                key={donor.id}
                position={{ lat, lng }}
                onClick={() => setSelectedDonor(donor)}
                title={`${donor.firstName} ${donor.lastName} - ${donor.bloodType.group}${donor.bloodType.rh}`}
              />
            );
          })}

          {selectedDonor && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedDonor.latitude),
                lng: parseFloat(selectedDonor.longitude)
              }}
              onCloseClick={() => setSelectedDonor(null)}
            >
              <Card className="border-0 shadow-none max-w-xs">
                <CardContent className="p-3">
                  {/* Blood Type Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <Badge className={`${getBloodTypeColor(selectedDonor.bloodType.group, selectedDonor.bloodType.rh)} text-sm font-bold px-2 py-1`}>
                      {selectedDonor.bloodType.group}{selectedDonor.bloodType.rh}
                    </Badge>
                    {canDonateSoon(selectedDonor.lastDonationDate) && (
                      <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                        Có thể hiến
                      </Badge>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-semibold text-sm">{selectedDonor.firstName} {selectedDonor.lastName}</h4>
                        <p className="text-xs text-gray-500 capitalize">
                          {selectedDonor.gender === 'male' ? 'Nam' : selectedDonor.gender === 'female' ? 'Nữ' : 'Không xác định'}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedDonor.districtName || 'Không xác định'}, {selectedDonor.provinceName || 'Không xác định'}</span>
                    </div>

                    {/* Last Donation */}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <div>
                        <div className="text-xs text-gray-500">Lần hiến máu cuối:</div>
                        <div className="font-medium">{formatLastDonation(selectedDonor.lastDonationDate)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default DonorMap;
