import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCampaignById } from '@/services/CampaignService';
import { ProfileService } from '@/services/ProfileService';
import { DonationService } from '@/services/DonationService';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useAuthContext } from '@/providers/AuthProvider';


export default function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = React.useState('');
   const { isAuthenticated } = useAuthContext();

// Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to book an appointment');
      navigate('/sign-in', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch profile data
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: ProfileService.getProfile
  });

  // Fetch campaign data
  const { data: campaignData, isLoading: isCampaignLoading } = useGetCampaignById(id as string);
  const campaign = campaignData?.data;
  
  // Get collection date when campaign data is loaded
  const collectionDate = campaign ? new Date(campaign.bloodCollectionDate) : undefined;

  // Create donation request mutation
  const createDonationMutation = DonationService.useCreateDonationRequest();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async () => {
    if (!campaign || !collectionDate) return;

    try {
      await createDonationMutation.mutateAsync({
        campaignId: campaign.id,
        appointmentDate: collectionDate.toISOString(),
        note: note.trim()
      });

      toast.success('Your appointment has been booked successfully.');
      navigate('/campaigns');
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      
      // Check for authentication issues
      if (error.message?.includes('Authentication')) {
        toast.error('Please log in again to book your appointment');
        navigate('/sign-in');
      } else {
        toast.error(error.message || 'Failed to book appointment. Please try again.');
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Let the useEffect handle redirect
  }

  if (isProfileLoading || isCampaignLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto pt-8 pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Appointment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information Column */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData?.firstName || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData?.lastName || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileData?.phone || ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={profileData?.latitude || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={profileData?.longitude || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    value={profileData?.provinceName || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={profileData?.districtName || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ward">Ward</Label>
                  <Input
                    id="ward"
                    value={profileData?.wardName || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Input
                  id="bloodType"
                  value={profileData?.bloodType ? `${profileData.bloodType.group}${profileData.bloodType.rh}` : ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* Fixed appointment date display */}
              <div className="space-y-2">
                <Label>Appointment Date</Label>
                <div className="bg-gray-50 p-3 rounded-md border flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">
                    {collectionDate ? format(collectionDate, "PPP") : 'Loading date...'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your appointment is automatically scheduled for the blood collection date.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Additional Note</Label>
                <Input
                  id="note"
                  placeholder="Enter any additional information or special requirements"
                  className="min-h-[80px]"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                disabled={!collectionDate || createDonationMutation.isPending}
                onClick={handleSubmit}
              >
                {createDonationMutation.isPending ? "Booking..." : "Confirm Appointment"}
              </Button>
            </CardContent>
          </Card>

          {/* Campaign Details Column */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaign && (
                  <>
                    <div className="h-48 w-full mb-4 overflow-hidden rounded-lg">
                      <img
                        src={campaign.banner}
                        alt={campaign.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900">{campaign.name}</h3>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Campaign Period</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-100">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
                          <MapPin className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-red-600 font-medium uppercase tracking-wide mb-1">Location</p>
                          <p className="text-sm font-semibold text-gray-900 leading-relaxed">{campaign.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Blood Collection Date</p>
                          <p className="text-sm font-semibold text-gray-900">{formatDateTime(campaign.bloodCollectionDate)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-purple-100 rounded-full flex-shrink-0">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">Donation Target</p>
                          <p className="text-sm font-semibold text-gray-900">{campaign.limitDonation} blood units</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3">{campaign.description}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}