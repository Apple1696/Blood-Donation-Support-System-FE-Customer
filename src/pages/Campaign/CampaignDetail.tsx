import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, ArrowLeft, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { useGetCampaignById } from '@/services/CampaignService';
import { useParams, useNavigate } from 'react-router-dom';

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

  const isActive = campaign.status === 'active';
  const daysRemaining = getDaysRemaining(campaign.endDate);
  const isExpired = daysRemaining < 0;

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
              <div className="h-[400px] w-full">
                <img 
                  src={campaign.banner} 
                  alt={campaign.name}
                  className="w-full h-full object-cover"
                />
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md border ${
                    isActive && !isExpired 
                      ? 'bg-emerald-500/90 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/25' 
                      : 'bg-gray-500/90 text-white border-gray-400/50'
                  }`}>
                    {isActive && !isExpired ? 'Active Campaign' : 'Inactive'}
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Campaign Details */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Start Date</p>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(campaign.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-red-50/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-red-600 font-medium uppercase tracking-wide">End Date</p>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(campaign.endDate)}</p>
                  </div>
                </div>
                {isActive && !isExpired && (
                  <div className="flex items-start space-x-3 p-3 bg-green-50/50 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Time Remaining</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Location</p>
                    <p className="text-xs text-gray-600">Community Health Center</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Phone</p>
                    <p className="text-xs text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Email</p>
                    <p className="text-xs text-gray-600">info@blooddrive.org</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => navigate(`/book-appointment/${campaign.id}`)}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Book Appointment</span>
                </span>
              </button>
            </div>
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