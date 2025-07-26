import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { useUpdateEmergencyRequest, useDeleteEmergencyRequest } from "../../services/EmergencyService";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Loader2, MapPin, Calendar, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import type { EmergencyResponse } from "../../services/EmergencyService";
import { AddressService } from "@/services/AddressService";
import { useQueryClient } from "@tanstack/react-query";

interface EmergencyDetailProps {
  emergency: EmergencyResponse;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const EmergencyDetail: React.FC<EmergencyDetailProps> = ({ emergency, isOpen, onClose, children }) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const updateEmergencyMutation = useUpdateEmergencyRequest();
  const deleteEmergencyMutation = useDeleteEmergencyRequest();
  const queryClient = useQueryClient();

  // Add state for address selection
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedWardId, setSelectedWardId] = useState<string>("");

  // Add address data queries
  const { data: provinces = [], isLoading: isLoadingProvinces } = AddressService.useProvinces();
  const { data: districts = [], isLoading: isLoadingDistricts } = AddressService.useDistricts(selectedProvinceId);
  const { data: wards = [], isLoading: isLoadingWards } = AddressService.useWards(selectedDistrictId);

  // Set location IDs when emergency changes
  useEffect(() => {
    if (emergency) {
      setSelectedProvinceId(emergency.provinceCode || "");
      setSelectedDistrictId(emergency.districtCode || "");
      setSelectedWardId(emergency.wardCode || "");
    }
  }, [emergency]);

  // Handle province selection
  const handleProvinceChange = (value: string) => {
    setSelectedProvinceId(value);
    setSelectedDistrictId("");
    setSelectedWardId("");
  };

  // Handle district selection
  const handleDistrictChange = (value: string) => {
    setSelectedDistrictId(value);
    setSelectedWardId("");
  };

  // Handle ward selection
  const handleWardChange = (value: string) => {
    setSelectedWardId(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200"><Clock className="h-3 w-3" /> Đang Chờ</Badge>;
      case 'approved':
        return <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3" /> Đã Duyệt</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3" /> Từ Chối</Badge>;
      case 'contacts_provided':
        return <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"><CheckCircle className="h-3 w-3" />Cung Cấp Thông Tin Liên Hệ</Badge>;
      case 'expired':
        return <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-200"><Clock className="h-3 w-3" /> Đã Hết Hạn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBloodTypeBadge = (bloodGroup: string, bloodRh: string) => {
    return (
      <Badge className="bg-primary text-primary-foreground font-bold">
        {bloodGroup}{bloodRh}
      </Badge>
    );
  };

  const getComponentBadge = (component: string) => {
    const componentMap: Record<string, { label: string, className: string }> = {
      'plasma': { label: 'Huyết Tương', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'platelets': { label: 'Tiểu Cầu', className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'red_cells': { label: 'Hồng Cầu', className: 'bg-red-100 text-red-800 border-red-200' },
    };

    const { label, className } = componentMap[component] || { label: component, className: '' };
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const handleUpdateEmergency = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emergency) return;

    const formData = new FormData(e.currentTarget);

    // Find selected location names
    const province = provinces?.find(p => p.id === selectedProvinceId);
    const district = districts?.find(d => d.id === selectedDistrictId);
    const ward = wards?.find(w => w.id === selectedWardId);

    const payload = {
      requiredVolume: Number(formData.get('requiredVolume')),
      bloodGroup: formData.get('bloodGroup') as string,
      bloodRh: formData.get('bloodRh') as string,
      bloodTypeComponent: formData.get('bloodTypeComponent') as string,
      provinceCode: selectedProvinceId,
      districtCode: selectedDistrictId,
      wardCode: selectedWardId,
      provinceName: province?.name || "",
      districtName: district?.name || "",
      wardName: ward?.name || "",
    };

    updateEmergencyMutation.mutate(
      { id: emergency.id, payload },
      {
        onSuccess: () => {
          setIsUpdateDialogOpen(false);
          onClose();
          toast.success("Cập nhật yêu cầu khẩn cấp thành công");
          queryClient.invalidateQueries({ queryKey: ['emergencyRequests'] });
        },
        onError: (error) => {
          toast.error("Không thể cập nhật yêu cầu khẩn cấp");
          console.error("Update error:", error);
        }
      }
    );
  };

  const handleDeleteEmergency = () => {
    if (!emergency) return;

    deleteEmergencyMutation.mutate(emergency.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        onClose();
        toast.success("Xóa yêu cầu khẩn cấp thành công");
        queryClient.invalidateQueries({ queryKey: ['emergencyRequests'] });
      },
      onError: (error) => {
        toast.error("Không thể xóa yêu cầu khẩn cấp");
        console.error("Delete error:", error);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            {getStatusBadge(emergency.status)}
          </div>
        </DialogHeader>

        {/* Add rejection reason card if status is rejected */}
        {emergency.status === "rejected" && (
          <div className="mt-2">
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-2 text-primary">Lý do từ chối</h3>
              <p className="text-sm text-gray-700">{emergency.rejectionReason || "Không có lý do"}</p>
            </div>
          </div>
        )}

         <div className="space-y-4 py-2">
          {/* Card: Thông Tin Máu Yêu Cầu */}
          <div className="bg-white border rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Thông Tin Máu Yêu Cầu</h3>
              <div className="flex items-center gap-2">
                {getBloodTypeBadge(emergency.bloodType.group, emergency.bloodType.rh)}
                {getComponentBadge(emergency.bloodTypeComponent)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lượng Máu Yêu Cầu</p>
                <p className="font-medium text-lg">{emergency.requiredVolume} ml</p>
              </div>
              {emergency.usedVolume > 0 && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Lượng Đã Sử Dụng</p>
                  <p className="font-medium text-lg">{emergency.usedVolume} ml</p>
                </div>
              )}
            </div>
          </div>

          {/* Card: Địa Điểm */}
          <div className="bg-white border rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3">Địa Điểm</h3>
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{emergency.provinceName}</p>
                <p className="text-muted-foreground">
                  {emergency.districtName}, {emergency.wardName}
                </p>
              </div>
            </div>
          </div>

          {/* Card: Ngày Tạo */}
          <div className="bg-white border rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3">Ngày Tạo</h3>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{format(new Date(emergency.startDate), "dd/MM/yyyy")}</p>
            </div>
          </div>

          {/* Card: Danh Sách Người Liên Hệ Đề Xuất */}
          {emergency.status === "contacts_provided" && emergency.suggestedContacts && emergency.suggestedContacts.length > 0 && (
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-3 text-primary">Danh Sách Người Liên Hệ Đề Xuất</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border rounded-lg">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left font-semibold text-sm">Họ và Tên</th>
                      <th className="px-4 py-2 text-left font-semibold text-sm">Số Điện Thoại</th>
                      <th className="px-4 py-2 text-left font-semibold text-sm">Nhóm Máu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emergency.suggestedContacts.map((contact) => (
                      <tr key={contact.id} className="border-t">
                        <td className="px-4 py-2">{contact.lastName} {contact.firstName}</td>
                        <td className="px-4 py-2">{contact.phone}</td>
                        <td className="px-4 py-2">
                          <Badge className="bg-primary text-primary-foreground font-bold">
                            {contact.bloodType.group}{contact.bloodType.rh}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Card: Thông Tin Đơn Vị Máu */}
          {emergency.bloodUnit && (
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-3">Thông Tin Đơn Vị Máu</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Mã Đơn Vị</p>
                  <p className="font-medium">{emergency.bloodUnit.id || "Chưa được phân bổ"}</p>
                </div>
                {emergency.bloodUnit.donatedBy && (
                  <div>
                    <p className="text-sm text-muted-foreground">Người Hiến</p>
                    <p className="font-medium">{emergency.bloodUnit.donatedBy.name || "Ẩn danh"}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row justify-end gap-3 pt-4">
          {/* Only show update and delete if status is pending */}
          {emergency.status === "pending" && (
            <>
              <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setIsUpdateDialogOpen(true)}
                    className="min-w-24"
                  >
                    Cập Nhật
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Cập Nhật Yêu Cầu Khẩn Cấp</DialogTitle>
                    <DialogDescription>
                      Cập nhật thông tin của yêu cầu máu khẩn cấp này
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpdateEmergency} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Nhóm Máu</Label>
                        <Select name="bloodGroup" defaultValue={emergency.bloodType.group}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn Nhóm Máu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="AB">AB</SelectItem>
                            <SelectItem value="O">O</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bloodRh">Yếu Tố RH</Label>
                        <Select name="bloodRh" defaultValue={emergency.bloodType.rh}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn RH" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+">Dương (+)</SelectItem>
                            <SelectItem value="-">Âm (-)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Thành Phần và Lượng Máu Yêu Cầu trên cùng một hàng */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodTypeComponent">Thành Phần</Label>
                        <Select name="bloodTypeComponent" defaultValue={emergency.bloodTypeComponent}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn Thành Phần" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plasma">Huyết Tương</SelectItem>
                            <SelectItem value="platelets">Tiểu Cầu</SelectItem>
                            <SelectItem value="red_cells">Hồng Cầu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="requiredVolume">Lượng Máu Yêu Cầu (ml)</Label>
                        <Input
                          name="requiredVolume"
                          type="number"
                          defaultValue={emergency.requiredVolume}
                          min="1"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit" disabled={updateEmergencyMutation.isPending}>
                        {updateEmergencyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Lưu Thay Đổi
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="min-w-24"
                  >
                    Xóa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn yêu cầu máu khẩn cấp.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteEmergency}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deleteEmergencyMutation.isPending}
                    >
                      {deleteEmergencyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyDetail;