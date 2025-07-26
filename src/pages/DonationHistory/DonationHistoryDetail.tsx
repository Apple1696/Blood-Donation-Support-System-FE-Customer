import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, User, Phone, Droplets } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { type DonationRequest } from '@/services/DonationService';

interface DonationHistoryDetailProps {
  donation: DonationRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DonationStatus = 'rejected' | 'completed' | 'result_returned' |
  'appointment_confirmed' | 'appointment_cancelled' |
  'customer_cancelled' | 'customer_checked_in' | 'not_qualified' | 'no_show_after_checkin';

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

const StatusBadge = ({ status }: { status: DonationStatus }) => {
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

const DonationHistoryDetail = ({ donation, open, onOpenChange }: DonationHistoryDetailProps) => {
  if (!donation) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chi tiết yêu cầu hiến máu</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* First Row - Status */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Trạng thái hiện tại:</span>
              <StatusBadge status={mapStatusToDonationStatus(donation.currentStatus)} />
            </div>
          </div>

          {/* Second Row - Campaign and Donor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Thông tin chiến dịch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tên chiến dịch</p>
                  <p className="text-base font-semibold text-gray-900">{donation.campaign.name}</p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Mô tả</p>
                  <p className="text-sm text-gray-800">{donation.campaign.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ngày bắt đầu</p>
                    <p className="text-sm text-gray-800">
                      {format(new Date(donation.campaign.startDate), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ngày kết thúc</p>
                    <p className="text-sm text-gray-800">
                      {format(new Date(donation.campaign.endDate), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Địa điểm
                  </p>
                  <p className="text-sm text-gray-800">{donation.campaign.location}</p>
                </div>
              </CardContent>
            </Card>

            {/* Donor Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-green-500" />
                  Thông tin người hiến máu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Họ và tên</p>
                  <p className="text-base font-semibold text-gray-900">
                    {donation.donor.firstName} {donation.donor.lastName}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-red-500" />
                    Nhóm máu
                  </p>
                  <p className="text-base font-semibold text-red-600">
                    {donation.donor.bloodType.group}{donation.donor.bloodType.rh}
                  </p>
                </div>
                                
                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Số điện thoại
                  </p>
                  <p className="text-sm text-gray-800">{donation.donor.phone}</p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Địa chỉ
                  </p>
                  <div className="text-sm text-gray-800 space-y-1">
                    <p><span className="font-medium">Phường/Xã:</span> {donation.donor.wardName}</p>
                    <p><span className="font-medium">Quận/Huyện:</span> {donation.donor.districtName}</p>
                    <p><span className="font-medium">Tỉnh/TP:</span> {donation.donor.provinceName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Third Row - Time Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-orange-500" />
                Thông tin thời gian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">Ngày tạo</p>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800">
                      {format(new Date(donation.createdAt), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                    <p className="text-xs text-blue-600">
                      lúc {format(new Date(donation.createdAt), 'HH:mm', { locale: vi })}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">Ngày hẹn</p>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-semibold text-green-800">
                      {format(new Date(donation.appointmentDate), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                    <p className="text-xs text-green-600">
                      lúc {format(new Date(donation.appointmentDate), 'HH:mm', { locale: vi })}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">Cập nhật</p>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm font-semibold text-orange-800">
                      {format(new Date(donation.updatedAt), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                    <p className="text-xs text-orange-600">
                      lúc {format(new Date(donation.updatedAt), 'HH:mm', { locale: vi })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationHistoryDetail;