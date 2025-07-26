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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { vi } from "date-fns/locale";

export default function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = React.useState('');
  const { isAuthenticated } = useAuthContext();
  const [volume, setVolume] = React.useState<number>(200); // default value

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đặt lịch hẹn');
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
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
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
        note: note.trim(),
        volumeMl: volume
      });

      toast.success('Lịch hẹn của bạn đã được đặt thành công.');
      navigate('/campaigns');
    } catch (error: any) {
      console.error('Error booking appointment:', error);

      // Check for authentication issues
      if (error.message?.includes('Authentication')) {
        toast.error('Vui lòng đăng nhập lại để đặt lịch hẹn');
        navigate('/sign-in');
      } else {
        toast.error(error.message || 'Không thể đặt lịch hẹn. Vui lòng thử lại.');
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
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto pt-8 pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 ">Đặt Lịch Hẹn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information Column */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className='text-primary'>Thông Tin Cá Nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Tên</Label>
                  <Input
                    id="firstName"
                    value={profileData?.firstName || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Họ</Label>
                  <Input
                    id="lastName"
                    value={profileData?.lastName || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Điện Thoại</Label>
                <Input
                  id="phone"
                  value={profileData?.phone || ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>



              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Tỉnh/Thành Phố</Label>
                  <Input
                    id="province"
                    value={profileData?.provinceName || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">Quận/Huyện</Label>
                  <Input
                    id="district"
                    value={profileData?.districtName || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ward">Phường/Xã</Label>
                  <Input
                    id="ward"
                    value={profileData?.wardName || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Nhóm Máu</Label>
                <Input
                  id="bloodType"
                  value={profileData?.bloodType ? `${profileData.bloodType.group}${profileData.bloodType.rh}` : ''}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* Fixed appointment date display */}
              <div className="space-y-2">
                <Label>Ngày Hẹn</Label>
                <div className="bg-gray-50 p-3 rounded-md border flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-700">
                    {collectionDate ? format(collectionDate, "PPP", { locale: vi }) : 'Đang tải ngày...'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Lịch hẹn của bạn được tự động sắp xếp vào ngày thu thập máu.
                </p>
              </div>

              {/* Add this block below "Ngày hẹn" */}
              <div className="space-y-2">
                <Label htmlFor="volume" className='text-primary'>Lượng máu muốn hiến (ml)</Label>
                <Select value={volume.toString()} onValueChange={v => setVolume(Number(v))}>
                  <SelectTrigger id="volume" className="bg-gray-50">
                    <SelectValue placeholder="Chọn lượng máu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="200">200 ml</SelectItem>
                    <SelectItem value="250">250 ml</SelectItem>
                    <SelectItem value="300">300 ml</SelectItem>
                    <SelectItem value="350">350 ml</SelectItem>
                    <SelectItem value="450">450 ml</SelectItem>
                    <SelectItem value="500">500 ml</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi Chú Bổ Sung</Label>
                <Input
                  id="note"
                  placeholder="Nhập thông tin bổ sung hoặc yêu cầu đặc biệt"
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
                {createDonationMutation.isPending ? "Đang đặt lịch..." : "Xác Nhận Lịch Hẹn"}
              </Button>
            </CardContent>
          </Card>

          {/* Campaign Details Column */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle className='text-primary'>Chi Tiết Chiến Dịch</CardTitle>
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
                          <p className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Thời Gian Đăng Ký Chiến Dịch</p>
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
                          <p className="text-xs text-red-600 font-medium uppercase tracking-wide mb-1">Địa Điểm</p>
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
                          <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Ngày Hiến Máu</p>
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
                          <p className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">Mục Tiêu Hiến Máu</p>
                          <p className="text-sm font-semibold text-gray-900">{campaign.limitDonation} đơn vị máu</p>
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