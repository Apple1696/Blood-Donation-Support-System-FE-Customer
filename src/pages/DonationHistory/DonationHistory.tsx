import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, MapPin, Award, Heart, Clock, Droplets, Loader2, Filter, Check, Trash2, Info } from 'lucide-react';
import { DonationService, type DonationRequest } from '@/services/DonationService';
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
import DonationHistoryDetail from './DonationHistoryDetail';

// All possible status values
type DonationStatus = 'rejected' | 'completed' | 'result_returned' |
  'appointment_confirmed' | 'appointment_cancelled' |
  'customer_cancelled' | 'customer_checked_in' | 'not_qualified' | 'no_show_after_checkin';

interface StatusBadgeProps {
  status: DonationStatus;
}

const BloodDonationHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');
  const [cancelRequestId, setCancelRequestId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // State for result dialog
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);

  // State for detail dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<DonationRequest | null>(null);

  // Fetch donation result when dialog is open and id is set
  const { data: donationResult, isLoading: isResultLoading, error: resultError } =
    DonationService.useDonationResultById(selectedDonationId ?? '');

  // Status filters for each tab - initially include all statuses
  const allStatuses: DonationStatus[] = [
    'rejected', 'completed', 'result_returned',
    'appointment_confirmed', 'appointment_cancelled',
    'customer_cancelled', 'customer_checked_in', 'not_qualified', 'no_show_after_checkin'
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

  // Function to handle detail view
  const handleDetailView = (donation: DonationRequest) => {
    setSelectedDonation(donation);
    setDetailDialogOpen(true);
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
    'rejected': 'Bị từ chối',
    'completed': 'Đã hiến máu',
    'result_returned': 'Đã có kết quả',
    'appointment_confirmed': 'Đã xác nhận lịch hẹn',
    'appointment_cancelled': 'Đã hủy lịch hẹn',
    'customer_cancelled': 'Đã hủy',
    'customer_checked_in': 'Đã check-in',
    'not_qualified': 'Không đủ điều kiện',
    'no_show_after_checkin': 'Không đến sau khi đã check-in'
  };

  // Mapping API response status to our component status
  const mapStatusToDonationStatus = (status: string): DonationStatus => {
    if (
      status === 'rejected' ||
      status === 'completed' ||
      status === 'result_returned' ||
      status === 'appointment_confirmed' ||
      status === 'appointment_cancelled' ||
      status === 'customer_cancelled' ||
      status === 'customer_checked_in' ||
      status === 'not_qualified' ||
      status === 'no_show_after_checkin'
    ) {
      return status as DonationStatus;
    }
    return 'appointment_confirmed'; // Default fallback
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

  const canCancelAppointment = (appointment: DonationRequest): boolean => {
    if (appointment.currentStatus !== 'appointment_confirmed') return false;
    const now = new Date();
    const appointmentDate = new Date(appointment.appointmentDate);
    // Check if appointment is more than 24 hours away
    return appointmentDate.getTime() - now.getTime() > 24 * 60 * 60 * 1000;
  };


  const StatusBadge = ({ status }: StatusBadgeProps) => {
    const variants: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      confirmed: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      result_returned: 'bg-purple-100 text-purple-800',
      appointment_confirmed: 'bg-blue-100 text-blue-800',
      appointment_cancelled: 'bg-gray-100 text-gray-800',
      customer_cancelled: 'bg-red-100 text-red-800',
      customer_checked_in: 'bg-indigo-100 text-indigo-800',
      not_qualified: 'bg-yellow-100 text-yellow-800',
      no_show_after_checkin: 'bg-orange-100 text-orange-800'
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
        appointmentDate >= today &&
        donation.currentStatus !== 'pending';
    }
  ) || [];

  const completedDonations = donationData?.items.filter(
    donation => {
      // Check if status is in filter AND date is in the past
      const appointmentDate = new Date(donation.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0); // Normalize to beginning of day for comparison

      // Show history if status is in filter AND (date is in the past OR status is 'result_returned')
      return historyStatusFilters.includes(donation.currentStatus as DonationStatus) &&
        (appointmentDate < today || donation.currentStatus === 'result_returned' || donation.currentStatus === 'not_qualified' || donation.currentStatus === 'no_show_after_checkin') &&
        donation.currentStatus !== 'pending';
    }
  ) || [];

  // Status counts for badges in filter menu
  const getStatusCount = (status: DonationStatus, isPast: boolean) => {
    return donationData?.items.filter(donation => {
      const appointmentDate = new Date(donation.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);

      return donation.currentStatus === status &&
        (isPast ? appointmentDate < today : appointmentDate >= today)
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
                <Card key={donation.id} className="border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{donation.campaign.name}</CardTitle>
                        {/* Campaign Banner */}
                        {/* {donation.campaign.banner && (
                          <div className="mb-3">
                            <img 
                              src={donation.campaign.banner} 
                              alt={donation.campaign.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        )} */}
                        <CardDescription className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Ngày hiến máu: {format(new Date(donation.campaign.bloodCollectionDate), 'dd/MM/yyyy', { locale: vi })}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{donation.campaign.location}</span>
                          </div>
                        </CardDescription>
                      </div>
                      <StatusBadge status={mapStatusToDonationStatus(donation.currentStatus)} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-sm">Nhóm máu</p>
                        <p className="font-semibold text-red-600">
                          {donation.donor.bloodType.group}{donation.donor.bloodType.rh}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {/* Detail Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDetailView(donation)}
                        >
                          <Info className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                        
                        {/* Delete Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelRequest(donation.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                        
                        {/* Show "Xem kết quả" button if result is returned */}
                        {donation.currentStatus === 'result_returned' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDonationId(donation.id);
                              setResultDialogOpen(true);
                            }}
                          >
                            Xem kết quả
                          </Button>
                        )}
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

          {/* Result Dialog */}
          <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Kết quả hiến máu</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết về lần hiến máu của bạn
                </DialogDescription>
              </DialogHeader>
              {isResultLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                  <span className="ml-2">Đang tải kết quả...</span>
                </div>
              ) : resultError ? (
                <div className="text-center text-red-500 py-8">
                  {(resultError as Error).message || 'Không thể tải kết quả'}
                </div>
              ) : donationResult ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                  <div>
                    <p className="text-gray-500 mb-1">Nhóm máu của bạn</p>
                    <p className="font-bold text-xl text-red-600 mb-2">
                      {donationResult.bloodGroup}{donationResult.bloodRh}
                    </p>
                    <p className="text-gray-500 mb-1">Thể tích</p>
                    <p className="font-bold text-lg text-pink-600 mb-2">
                      {donationResult.volumeMl} ml
                    </p>
                    <p className="text-gray-500 mb-1">Ghi chú</p>
                    <p className="font-semibold text-gray-800 mb-2">
                      {donationResult.notes || 'Không có ghi chú'}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-1 text-primary ">Người xử lý</p>
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={donationResult.processedBy.avatar} alt={donationResult.processedBy.firstName} />
                      <AvatarFallback>
                        {donationResult.processedBy.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-gray-900">
                      {donationResult.processedBy.firstName} {donationResult.processedBy.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{donationResult.processedBy.role}</p>
                  </div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>

          {/* Detail Dialog */}
          <DonationHistoryDetail 
            donation={selectedDonation}
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
          />

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
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{appointment.campaign.name}</CardTitle>
                        {/* Campaign Banner */}
                        {/* {appointment.campaign.banner && (
                          <div className="mb-3">
                            <img 
                              src={appointment.campaign.banner} 
                              alt={appointment.campaign.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                        )} */}
                        <CardDescription className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Ngày hiến máu: {format(new Date(appointment.campaign.bloodCollectionDate), 'dd/MM/yyyy', { locale: vi })}</span>
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
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-sm">Nhóm máu</p>
                        <p className="font-semibold text-red-600">
                          {appointment.donor.bloodType.group}{appointment.donor.bloodType.rh}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {/* Detail Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDetailView(appointment)}
                        >
                          <Info className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                        
                        {/* Hide "Hủy lịch hẹn" button for certain statuses */}
                        {!(
                          appointment.currentStatus === 'customer_checked_in' ||
                          appointment.currentStatus === 'completed' ||
                          appointment.currentStatus === 'result_returned' ||
                          appointment.currentStatus === 'customer_cancelled' ||
                          appointment.currentStatus === 'appointment_cancelled' ||
                          appointment.currentStatus === 'not_qualified' ||
                          appointment.currentStatus === 'no_show_after_checkin'
                        ) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelRequest(appointment.id)}
                              disabled={
                                appointment.currentStatus === 'appointment_confirmed' && !canCancelAppointment(appointment)
                                || (isCancelling && cancelRequestId === appointment.id)
                              }
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              {isCancelling && cancelRequestId === appointment.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Đang hủy...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Hủy lịch hẹn
                                </>
                              )}
                            </Button>
                          )}
                      </div>
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