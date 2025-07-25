import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Calendar, MapPin, Award, Heart, Clock, Droplets, Loader2, Filter, Check } from 'lucide-react';
import { DonationService } from '@/services/DonationService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


// All possible status values
type DonationStatus = 'pending' | 'rejected' | 'completed' | 'result_returned' |
  'appointment_confirmed' | 'appointment_cancelled' |
  'customer_cancelled' | 'customer_checked_in';

interface StatusBadgeProps {
  status: DonationStatus;
}

const BloodDonationHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');
  const [cancelRequestId, setCancelRequestId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Status filters for each tab - initially include all statuses
  const allStatuses: DonationStatus[] = [
    'pending', 'rejected', 'completed', 'result_returned',
    'appointment_confirmed', 'appointment_cancelled',
    'customer_cancelled', 'customer_checked_in'
  ];

  const [historyStatusFilters, setHistoryStatusFilters] = useState<DonationStatus[]>(allStatuses);
  const [upcomingStatusFilters, setUpcomingStatusFilters] = useState<DonationStatus[]>(allStatuses);

  // Use React Query to fetch donation requests
  const { data: donationData, isLoading, error } = DonationService.useMyDonationRequests();

  // Use the cancel donation mutation
  const { mutate: cancelRequest, isPending: isCancelling } = DonationService.useCancelDonationRequest();

  // Function to handle cancel request
  const handleCancelRequest = (id: string) => {
    setCancelRequestId(id);
    setCancelDialogOpen(true);
  };

  // Function to confirm cancellation
  const confirmCancellation = () => {
    if (cancelRequestId) {
      cancelRequest(cancelRequestId, {
        onSuccess: () => {
          toast("Hủy yêu cầu hiến máu thành công", {
            description: "Yêu cầu hiến máu của bạn đã được hủy thành công"
          });
          setCancelDialogOpen(false);
        },
        onError: (error) => {
          toast.error("Lỗi khi hủy yêu cầu", {
            description: (error as Error).message || "Không thể hủy yêu cầu hiến máu"
          });
          setCancelDialogOpen(false);
        }
      });
    }
  };

  // Status labels for filter dropdown
  const statusLabels: Record<DonationStatus, string> = {
    'pending': 'Chờ xác nhận',
    'rejected': 'Bị từ chối',
    'completed': 'Đã hiến máu',
    'result_returned': 'Đã có kết quả',
    'appointment_confirmed': 'Đã xác nhận lịch hẹn',
    'appointment_cancelled': 'Đã hủy lịch hẹn',
    'customer_cancelled': 'Đã hủy',
    'customer_checked_in': 'Đã check-in'
  };

  // Mapping API response status to our component status
  const mapStatusToDonationStatus = (status: string): DonationStatus => {
    if (
      status === 'pending' ||
      status === 'rejected' ||
      status === 'completed' ||
      status === 'result_returned' ||
      status === 'appointment_confirmed' ||
      status === 'appointment_cancelled' ||
      status === 'customer_cancelled' ||
      status === 'customer_checked_in'
    ) {
      return status as DonationStatus;
    }
    return 'pending'; // Default fallback
  };

  // Stats calculation based on real data
  const stats = {
    totalDonations: donationData?.items.length || 0,
    totalAmount: donationData?.items.length ? `${donationData.items.length * 0.45}L` : '0L',
    livesImpacted: donationData?.items.length ? donationData.items.length * 3 : 0,
    nextEligibleDate: donationData?.items.length ?
      // Calculate next eligible date (3 months after last donation)
      format(
        new Date(
          new Date(donationData.items[0].appointmentDate).setMonth(
            new Date(donationData.items[0].appointmentDate).getMonth() + 3
          )
        ),
        'dd/MM/yyyy',
        { locale: vi }
      ) :
      'Chưa có'
  };

  const achievements = [
    { title: 'Người Hùng Lần Đầu', description: 'Hoàn thành lần hiến máu đầu tiên', earned: stats.totalDonations >= 1 },
    { title: 'Người Cứu Mạng', description: 'Hiến máu 3 lần', earned: stats.totalDonations >= 3 },
    { title: 'Người Hùng Thường Xuyên', description: 'Hiến máu 5 lần', earned: stats.totalDonations >= 5, progress: (stats.totalDonations / 5) * 100 },
    { title: 'Nhà Vô Địch Cộng Đồng', description: 'Tham gia 3 chiến dịch khác nhau', earned: donationData?.items.filter((v, i, a) => a.findIndex(t => t.campaign.id === v.campaign.id) === i).length >= 3 }
  ];

  const StatusBadge = ({ status }: StatusBadgeProps) => {
    const variants: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      result_returned: 'bg-purple-100 text-purple-800',
      appointment_confirmed: 'bg-blue-100 text-blue-800',
      appointment_cancelled: 'bg-gray-100 text-gray-800',
      customer_cancelled: 'bg-red-100 text-red-800',
      customer_checked_in: 'bg-indigo-100 text-indigo-800',
    };

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {statusLabels[status as DonationStatus] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen container mx-auto pt-8 pb-8 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-red-500" />
          <p>Đang tải lịch sử hiến máu của bạn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen container mx-auto pt-8 pb-8 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Không thể tải lịch sử hiến máu</p>
          <p className="text-gray-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  // Separate upcoming (pending/confirmed) and past (completed) donations with filters
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of today

  const upcomingAppointments = donationData?.items.filter(
    donation => {
      // Check if status is in filter AND date is today or in the future
      const appointmentDate = new Date(donation.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0); // Normalize to beginning of day for comparison

      return upcomingStatusFilters.includes(donation.currentStatus as DonationStatus) &&
        appointmentDate >= today;
    }
  ) || [];

  const completedDonations = donationData?.items.filter(
    donation => {
      // Check if status is in filter AND date is in the past
      const appointmentDate = new Date(donation.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0); // Normalize to beginning of day for comparison

      return historyStatusFilters.includes(donation.currentStatus as DonationStatus) &&
        appointmentDate < today;
    }
  ) || [];

  // Status counts for badges in filter menu
  const getStatusCount = (status: DonationStatus, isPast: boolean) => {
    return donationData?.items.filter(donation => {
      const appointmentDate = new Date(donation.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);

      return donation.currentStatus === status &&
        (isPast ? appointmentDate < today : appointmentDate >= today);
    }).length || 0;
  };

  return (
    <div className="min-h-screen container mx-auto pt-15 pb-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-3xl font-bold text-gray-900 text-primary">Hành Trình Hiến Máu Của Tôi</h1>
          </div>
          <p className="text-gray-600">Theo dõi lịch sử hiến máu và tác động của bạn</p>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Lịch Sử Hiến Máu</TabsTrigger>
            <TabsTrigger value="upcoming">Lịch Hẹn Sắp Tới</TabsTrigger>
            {/* <TabsTrigger value="achievements">Thành Tựu</TabsTrigger> */}
          </TabsList>

          {/* Donation History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-end mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Lọc 
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {allStatuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => {
                        setHistoryStatusFilters(prev =>
                          prev.includes(status)
                            ? prev.filter(s => s !== status)
                            : [...prev, status]
                        );
                      }}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center">
                        {statusLabels[status]}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {getStatusCount(status, true)}
                        </Badge>
                      </span>
                      {historyStatusFilters.includes(status) && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {completedDonations.length > 0 ? (
              completedDonations.map((donation) => (
                <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{donation.campaign.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(donation.appointmentDate), 'dd/MM/yyyy', { locale: vi })}</span>
                          <MapPin className="h-4 w-4 ml-2" />
                          <span>{donation.campaign.location}</span>
                        </CardDescription>
                      </div>
                      <StatusBadge status={mapStatusToDonationStatus(donation.currentStatus)} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Nhóm máu</p>
                        <p className="font-semibold text-red-600">
                          {donation.donor.bloodType.group}{donation.donor.bloodType.rh}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Lượng máu</p>
                        <p className="font-semibold">450ml</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Kiểm tra sức khỏe</p>
                        <p className="font-semibold capitalize text-green-600">đạt yêu cầu</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Đủ điều kiện hiến tiếp</p>
                        <p className="font-semibold">
                          {format(
                            new Date(
                              new Date(donation.appointmentDate).setMonth(
                                new Date(donation.appointmentDate).getMonth() + 3
                              )
                            ),
                            'dd/MM/yyyy',
                            { locale: vi }
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Droplets className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có lịch sử hiến máu</h3>
                  <p className="text-gray-500 mb-4">Các lần hiến máu đã hoàn thành sẽ hiển thị tại đây.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            <div className="flex justify-end mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Lọc 
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {allStatuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => {
                        setUpcomingStatusFilters(prev =>
                          prev.includes(status)
                            ? prev.filter(s => s !== status)
                            : [...prev, status]
                        );
                      }}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center">
                        {statusLabels[status]}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {getStatusCount(status, false)}
                        </Badge>
                      </span>
                      {upcomingStatusFilters.includes(status) && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-l-4 border-l-pink-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{appointment.campaign.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(appointment.appointmentDate), 'dd/MM/yyyy', { locale: vi })}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{appointment.campaign.location}</span>
                          </div>
                        </CardDescription>
                      </div>
                      <StatusBadge status={mapStatusToDonationStatus(appointment.currentStatus)} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      {appointment.currentStatus !== 'customer_cancelled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelRequest(appointment.id)}
                          disabled={isCancelling && cancelRequestId === appointment.id}
                        >
                          {isCancelling && cancelRequestId === appointment.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Đang hủy...
                            </>
                          ) : (
                            'Hủy lịch hẹn'
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => window.open('https://maps.app.goo.gl/HdP1dnVhCjCznvcGA', '_blank')}
                      >
                        Xem đường đi
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có lịch hẹn sắp tới</h3>
                  <p className="text-gray-500 mb-4">Sẵn sàng cứu thêm nhiều mạng sống? Đặt lịch hiến máu tiếp theo của bạn.</p>
                  <Button onClick={() => navigate('/campaigns')} className="bg-red-600 hover:bg-red-700">Đặt lịch hiến máu</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          {/* <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`${achievement.earned ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className={`${achievement.earned ? 'bg-yellow-500' : 'bg-gray-300'}`}>
                        <AvatarFallback>
                          <Award className="h-6 w-6 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{achievement.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{achievement.description}</p>
                        {achievement.earned ? (
                          <Badge className="bg-yellow-500 text-white">Đã đạt được!</Badge>
                        ) : (
                          <div className="space-y-2">
                            <Progress value={achievement.progress} className="h-2" />
                            <p className="text-xs text-gray-500">{Math.round(achievement.progress || 0)}% hoàn thành</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent> */}
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
          <CardContent className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sẵn sàng tạo ra sự khác biệt một lần nữa?</h2>
            <p className="mb-6 opacity-90">Lần hiến máu tiếp theo của bạn có thể cứu được tới 3 mạng sống. Mỗi giọt máu đều có ý nghĩa.</p>
            <Button onClick={() => navigate('/campaigns')} size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
              Đặt lịch hiến máu tiếp theo
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy yêu cầu hiến máu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy yêu cầu hiến máu này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Không, giữ lại</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancellation}
              className="bg-red-600 hover:bg-red-700"
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang hủy...
                </>
              ) : (
                'Có, hủy yêu cầu'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default BloodDonationHistory;