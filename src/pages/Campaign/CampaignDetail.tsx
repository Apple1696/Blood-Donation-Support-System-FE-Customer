import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, ArrowLeft, MapPin, Phone, Mail, CheckCircle, Users, Droplets } from 'lucide-react';
import { useGetCampaignById, CampaignStatus } from '@/services/CampaignService';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CampaignDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: campaignData, isLoading, error } = useGetCampaignById(id as string);
  const campaign = campaignData?.data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
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

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading campaign details. Please try again later.</p>
          <button 
            onClick={() => navigate('/campaigns')}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  const getStatusDetails = () => {
    switch (campaign.status) {
      case CampaignStatus.NOT_STARTED:
        return {
          color: 'bg-blue-500/90',
          borderColor: 'border-blue-400/50',
          shadowColor: 'shadow-blue-500/25',
          label: 'Not Started',
          message: 'This campaign has not started yet'
        };
      case CampaignStatus.ENDED:
        return {
          color: 'bg-gray-500/90',
          borderColor: 'border-gray-400/50',
          shadowColor: 'shadow-gray-500/25',
          label: 'Ended',
          message: 'This campaign has ended'
        };
      case CampaignStatus.ACTIVE:
      default:
        return {
          color: 'bg-emerald-500/90',
          borderColor: 'border-emerald-400/50',
          shadowColor: 'shadow-emerald-500/25',
          label: 'Active',
          message: 'This campaign is currently active'
        };
    }
  };

  const statusDetails = getStatusDetails();
  const daysRemaining = getDaysRemaining(campaign.endDate);
  const daysUntilStart = Math.abs(getDaysRemaining(campaign.startDate));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 py-8">
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <button 
          onClick={() => navigate('/campaigns')}
          className="bg-white/90 text-gray-700 p-3 rounded-full hover:bg-white/100 transition-all duration-300 group shadow-md"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
              {/* Campaign Image */}
              <div className="h-[400px] w-full relative">
                <img 
                  src={campaign.banner} 
                  alt={campaign.name}
                  className="w-full h-full object-cover"
                />
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md border ${statusDetails.color} text-white ${statusDetails.borderColor} shadow-lg ${statusDetails.shadowColor}`}>
                    {statusDetails.label}
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Campaign Title and Description */}
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      {campaign.name}
                    </h1>
                  </div>



                  {/* About Section */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Campaign</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {campaign.description}
                      </p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Donation Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'Age: 18-65 years old',
                        'Weight: Minimum 50kg',
                        'Good general health',
                        'No recent illness or medication',
                        'Valid ID required',
                        'Fasting not required'
                      ].map((requirement, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{requirement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Campaign Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Start Date</p>
                          <p className="text-sm font-semibold text-gray-900">{formatDate(campaign.startDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-red-50/50 rounded-lg border border-red-100">
                        <Calendar className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-red-600 font-medium uppercase tracking-wide">End Date</p>
                          <p className="text-sm font-semibold text-gray-900">{formatDate(campaign.endDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-green-50/50 rounded-lg border border-green-100">
                        <Droplets className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Blood Collection</p>
                          <p className="text-sm font-semibold text-gray-900">{formatDateTime(campaign.bloodCollectionDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-purple-50/50 rounded-lg border border-purple-100">
                        <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Donation Target</p>
                          <p className="text-sm font-semibold text-gray-900">{campaign.limitDonation} blood units</p>
                        </div>
                      </div>
                      {campaign.status === CampaignStatus.ACTIVE && daysRemaining > 0 && (
                        <div className="flex items-start space-x-3 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
                          <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                          <div>
                            <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Time Remaining</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
                            </p>
                          </div>
                        </div>
                      )}
                      {campaign.status === CampaignStatus.NOT_STARTED && (
                        <div className="flex items-start space-x-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Starting In</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {daysUntilStart} {daysUntilStart === 1 ? 'day' : 'days'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location Info */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span>Location & Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-100">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-red-600 font-medium uppercase tracking-wide mb-1">Campaign Location</p>
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

                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-colors">
                    <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Phone Support</p>
                      <p className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-purple-50/50 rounded-lg hover:bg-purple-50 transition-colors">
                    <Mail className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Email Support</p>
                      <p className="text-sm text-purple-600 hover:text-purple-700 cursor-pointer break-all">BloodLink@gmail.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {campaign.status === CampaignStatus.ACTIVE && (
                    <>
                      <h3 className="text-xl font-bold">Ready to Save Lives?</h3>
                      <p className="opacity-90">Join this campaign and make a difference today.</p>
                      <Button
                      onClick={() => navigate(`/book-appointment/${campaign.id}`)}
                      className="w-full bg-white text-red-600 hover:bg-gray-100">
                        Book Appointment
                      </Button>
                    </>
                  )}
                  {campaign.status === CampaignStatus.NOT_STARTED && (
                    <>
                      <h3 className="text-xl font-bold">Get Notified</h3>
                      <p className="opacity-90">Be the first to know when this campaign starts.</p>
                      <Button className="w-full bg-white text-red-600 hover:bg-gray-100">
                        Set Reminder
                      </Button>
                    </>
                  )}
                  {campaign.status === CampaignStatus.ENDED && (
                    <>
                      <h3 className="text-xl font-bold">Campaign Ended</h3>
                      <p className="opacity-90">Thank you for your interest. Check out our other active campaigns.</p>
                      <Button className="w-full bg-white text-red-600 hover:bg-gray-100" onClick={() => navigate('/campaigns')}>
                        View Active Campaigns
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        .prose p {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default CampaignDetail;