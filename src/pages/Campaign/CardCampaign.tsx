import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, Search, Filter, Check } from 'lucide-react';
import { useGetCampaigns, CampaignStatus } from '@/services/CampaignService';
import type { Campaign } from '@/services/CampaignService';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusDetails = () => {
    switch (campaign.status) {
      case CampaignStatus.NOT_STARTED:
        return {
          color: 'bg-blue-500/90',
          borderColor: 'border-blue-400/50',
          shadowColor: 'shadow-blue-500/25',
          label: 'Not Started'
        };
      case CampaignStatus.ENDED:
        return {
          color: 'bg-gray-500/90',
          borderColor: 'border-gray-400/50',
          shadowColor: 'shadow-gray-500/25',
          label: 'Ended'
        };
      case CampaignStatus.ACTIVE:
      default:
        return {
          color: 'bg-emerald-500/90',
          borderColor: 'border-emerald-400/50',
          shadowColor: 'shadow-emerald-500/25',
          label: 'Active'
        };
    }
  };

  const statusDetails = getStatusDetails();
  const daysRemaining = getDaysRemaining(campaign.endDate);
  const daysUntilStart = Math.abs(getDaysRemaining(campaign.startDate));

  return (
    <Card 
      className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/campaigns/${campaign.id}`)}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Status badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${statusDetails.color} text-white ${statusDetails.borderColor} shadow-lg ${statusDetails.shadowColor}`}>
          {statusDetails.label}
        </div>
      </div>

      {/* Banner image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={campaign.banner} 
          alt={campaign.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <CardHeader className="relative z-10 pb-2 flex-none">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-red-600 group-hover:to-pink-600 transition-all duration-500">
          {campaign.name}
        </CardTitle>
        <p className="text-gray-600 text-sm line-clamp-2 h-10 group-hover:text-gray-700 transition-colors">
          {campaign.description}
        </p>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4 flex-1 flex flex-col">
        {/* Date range */}
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
          <div className="p-2 bg-blue-500/10 rounded-full">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Duration</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </p>
          </div>
        </div>

        {/* Days remaining/starting */}
        {campaign.status === CampaignStatus.ACTIVE && daysRemaining > 0 && (
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100/50">
            <div className="p-2 bg-green-500/10 rounded-full">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Time Left</p>
              <p className="text-sm font-semibold text-gray-900">
                {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
              </p>
            </div>
          </div>
        )}
        {campaign.status === CampaignStatus.NOT_STARTED && (
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Starting In</p>
              <p className="text-sm font-semibold text-gray-900">
                {daysUntilStart} {daysUntilStart === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
        )}

        <div className="flex-1" /> {/* Spacer */}

        {/* Action button */}
        <button 
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/campaigns/${campaign.id}`);
          }}
        >
          <span className="flex items-center justify-center space-x-2">
            <Users className="w-4 h-4" />
            <span>
              {campaign.status === CampaignStatus.ACTIVE && 'Join Campaign'}
              {campaign.status === CampaignStatus.NOT_STARTED && 'Get Notified'}
              {campaign.status === CampaignStatus.ENDED && 'View Details'}
            </span>
          </span>
        </button>
      </CardContent>

      {/* Decorative elements */}
      <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </Card>
  );
};

export default function BloodDonationCampaigns() {
  const { data: campaignData, isLoading, error } = useGetCampaigns();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<CampaignStatus[]>([
    CampaignStatus.ACTIVE,
    CampaignStatus.NOT_STARTED,
    CampaignStatus.ENDED
  ]);
  
  const sortCampaigns = (campaigns: Campaign[]) => {
    const statusOrder = {
      [CampaignStatus.ACTIVE]: 0,
      [CampaignStatus.NOT_STARTED]: 1,
      [CampaignStatus.ENDED]: 2
    };

    return [...campaigns].sort((a, b) => {
      // First sort by status order
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      // If same status, sort by start date (most recent first)
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  };

  const filterCampaigns = (campaigns: Campaign[]) => {
    return sortCampaigns(campaigns).filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatuses.includes(campaign.status);
      return matchesSearch && matchesStatus;
    });
  };

  const campaigns = filterCampaigns(campaignData?.data.data || []);

  const statusLabels = {
    [CampaignStatus.ACTIVE]: 'Active Campaigns',
    [CampaignStatus.NOT_STARTED]: 'Upcoming Campaigns',
    [CampaignStatus.ENDED]: 'Past Campaigns'
  };

  if (isLoading) {
    return (
      <div className="container mx-auto min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading campaigns. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
      {/* Header */}
      <div className="relative overflow-hidden p-0 bg-gradient-to-r from-red-600 via-red-500 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm mb-6">
              <Heart className="w-8 h-8 fill-current" />
            </div> */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
              Blood Donation Campaigns
            </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Join our life-saving campaigns and make a difference in your community
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{campaigns.length}</div>
              <div className="text-gray-600 font-medium">Total Campaigns</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {campaigns.filter(c => c.status === 'active').length}
              </div>
              <div className="text-gray-600 font-medium">Currently Running</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-gray-600 font-medium">Lives Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {Object.values(CampaignStatus).map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => {
                    setSelectedStatuses(prev =>
                      prev.includes(status)
                        ? prev.filter(s => s !== status)
                        : [...prev, status]
                    );
                  }}
                  className="flex items-center justify-between"
                >
                  {statusLabels[status]}
                  {selectedStatuses.includes(status) && (
                    <Check className="h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="container mx-auto px-4 pb-16">
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign, index) => (
              <div 
                key={campaign.id} 
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No campaigns found matching your criteria.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .line-clamp-2 { 
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}