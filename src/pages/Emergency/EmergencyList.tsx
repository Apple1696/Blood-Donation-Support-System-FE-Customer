import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { useGetEmergencyRequests, useUpdateEmergencyRequest, useDeleteEmergencyRequest } from "../../services/EmergencyService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import { Separator } from "../../components/ui/separator";
import { Loader2, AlertCircle, Clock, CheckCircle, XCircle, MapPin, Calendar, Eye } from "lucide-react";
import type { EmergencyRequestFilters, EmergencyResponse, } from "../../services/EmergencyService";
import { AddressService } from "@/services/AddressService";
import { useQueryClient } from "@tanstack/react-query";

const EmergencyList: React.FC = () => {
    const navigate = useNavigate();
    const [editingEmergency, setEditingEmergency] = useState<EmergencyResponse | null>(null);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedEmergency, setSelectedEmergency] = useState<EmergencyResponse | null>(null);
    const [emergencyToDelete, setEmergencyToDelete] = useState<string | null>(null);
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

    const [filters, setFilters] = useState<EmergencyRequestFilters>({
        page: 1,
        limit: 8,
        status: undefined,
        bloodGroup: undefined,
        bloodRh: undefined,
        bloodTypeComponent: undefined,
    });

    // Set location IDs when editing emergency
    useEffect(() => {
        if (editingEmergency) {
            setSelectedProvinceId(editingEmergency.provinceCode || "");
            setSelectedDistrictId(editingEmergency.districtCode || "");
            setSelectedWardId(editingEmergency.wardCode || "");
        }
    }, [editingEmergency]);

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

    const { data, isLoading, isError } = useGetEmergencyRequests(filters);

    const handleFilterChange = (key: keyof EmergencyRequestFilters, value: string | number | undefined) => {
        // If value is "all", set to undefined instead of empty string
        setFilters(prev => ({ ...prev, [key]: value === "all" ? undefined : value, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleViewDetails = (id: string) => {
        navigate(`/emergency/${id}`);
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

    const handleUpdateClick = (emergency: EmergencyResponse) => {
        setEditingEmergency(emergency);
        setSelectedProvinceId(emergency.provinceCode || "");
        setSelectedDistrictId(emergency.districtCode || "");
        setSelectedWardId(emergency.wardCode || "");
        setIsUpdateDialogOpen(true);
    };

    const handleDetailClick = (emergency: EmergencyResponse) => {
        setSelectedEmergency(emergency);
        setEditingEmergency(emergency);
        setSelectedProvinceId(emergency.provinceCode || "");
        setSelectedDistrictId(emergency.districtCode || "");
        setSelectedWardId(emergency.wardCode || "");
        setIsDetailDialogOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setEmergencyToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleUpdateEmergency = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingEmergency) return;

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
            { id: editingEmergency.id, payload },
            {
                onSuccess: () => {
                    setIsUpdateDialogOpen(false);
                    setIsDetailDialogOpen(false);
                    setEditingEmergency(null);
                    setSelectedEmergency(null);
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
        if (!emergencyToDelete) return;

        deleteEmergencyMutation.mutate(emergencyToDelete, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setIsDetailDialogOpen(false);
                setEmergencyToDelete(null);
                setSelectedEmergency(null);
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
        <div className="container mx-auto py-20 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Yêu Cầu Máu Khẩn Cấp</h1>
                    <p className="text-muted-foreground">Xem và quản lý các yêu cầu hiến máu khẩn cấp</p>
                </div>
                <Button onClick={() => navigate('/request-emergency')} className="mt-4 md:mt-0" variant="default">Yêu Cầu Mới</Button>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-lg p-4 mb-8 border">
                <h2 className="text-lg font-medium mb-4">Bộ Lọc</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Trạng Thái</label>
                        <Select
                            value={filters.status || "all"}
                            onValueChange={(value) => handleFilterChange('status', value === "all" ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất Cả Trạng Thái</SelectItem>
                                <SelectItem value="pending">Đang Chờ</SelectItem>
                                <SelectItem value="approved">Đã Duyệt</SelectItem>
                                <SelectItem value="rejected">Từ Chối</SelectItem>
                                <SelectItem value="contacts_provided">Cung Cấp Thông Tin Liên Hệ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nhóm Máu</label>
                        <Select
                            value={filters.bloodGroup || "all"}
                            onValueChange={(value) => handleFilterChange('bloodGroup', value === "all" ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tất Cả Nhóm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất Cả Nhóm</SelectItem>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="AB">AB</SelectItem>
                                <SelectItem value="O">O</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Yếu Tố RH</label>
                        <Select
                            value={filters.bloodRh || "all"}
                            onValueChange={(value) => handleFilterChange('bloodRh', value === "all" ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tất Cả RH" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất Cả RH</SelectItem>
                                <SelectItem value="+">Dương (+)</SelectItem>
                                <SelectItem value="-">Âm (-)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Thành Phần</label>
                        <Select
                            value={filters.bloodTypeComponent || "all"}
                            onValueChange={(value) => handleFilterChange('bloodTypeComponent', value === "all" ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tất Cả Thành Phần" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất Cả Thành Phần</SelectItem>
                                <SelectItem value="plasma">Huyết Tương</SelectItem>
                                <SelectItem value="platelets">Tiểu Cầu</SelectItem>
                                <SelectItem value="red_cells">Hồng Cầu</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center items-center p-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Đang tải yêu cầu khẩn cấp...</span>
                </div>
            ) : isError ? (
                <div className="flex justify-center items-center p-16 text-destructive">
                    <AlertCircle className="h-8 w-8" />
                    <span className="ml-2">Lỗi khi tải yêu cầu khẩn cấp. Vui lòng thử lại.</span>
                </div>
            ) : (
                <>
                    {!data || !Array.isArray(data.data) || data.data.length === 0 ? (
                        <div className="text-center p-16">
                            <p className="text-muted-foreground">Không tìm thấy yêu cầu khẩn cấp phù hợp với bộ lọc của bạn.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {data.data.map((emergency: EmergencyResponse) => (
                                    <Card key={emergency.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-xl">{getBloodTypeBadge(emergency.bloodType.group, emergency.bloodType.rh)}</CardTitle>
                                                    {/* <CardDescription className="mt-1">
                                                        {emergency.requestedBy?.name || "Unknown Requestor"}
                                                    </CardDescription> */}
                                                </div>
                                                {getStatusBadge(emergency.status)}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Thành phần:</span>
                                                    <span>{getComponentBadge(emergency.bloodTypeComponent)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Yêu cầu:</span>
                                                    <span className="font-medium">{emergency.requiredVolume} ml</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Địa điểm:</span>
                                                    <span className="text-right text-sm">{emergency.wardName}, {emergency.districtName}, {emergency.provinceName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Ngày tạo:</span>
                                                    <span className="text-right text-sm">
                                                        {format(new Date(emergency.startDate), "dd/MM/yyyy")}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-2 flex justify-center">
                                            <Dialog open={isDetailDialogOpen && selectedEmergency?.id === emergency.id} onOpenChange={(open) => {
                                                if (!open) {
                                                    setSelectedEmergency(null);
                                                    setEditingEmergency(null);
                                                }
                                                setIsDetailDialogOpen(open);
                                            }}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDetailClick(emergency)}
                                                        className="w-full"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Chi Tiết
                                                    </Button>
                                                </DialogTrigger>

                                                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <div className="flex justify-between items-center">
                                                            {selectedEmergency && getStatusBadge(selectedEmergency.status)}
                                                        </div>
                                                    </DialogHeader>
                                                    
                                                    {selectedEmergency && (
                                                        <div className="space-y-4 py-2">
                                                            <div className="bg-muted/50 p-4 rounded-lg">
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <h3 className="text-lg font-semibold">Thông Tin Máu Yêu Cầu</h3>
                                                                    <div className="flex items-center gap-2">
                                                                        {getBloodTypeBadge(selectedEmergency.bloodType.group, selectedEmergency.bloodType.rh)}
                                                                        {getComponentBadge(selectedEmergency.bloodTypeComponent)}
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm text-muted-foreground">Lượng Máu Yêu Cầu</p>
                                                                        <p className="font-medium text-lg">{selectedEmergency.requiredVolume} ml</p>
                                                                    </div>
                                                                    {selectedEmergency.usedVolume > 0 && (
                                                                        <div className="space-y-1">
                                                                            <p className="text-sm text-muted-foreground">Lượng Đã Sử Dụng</p>
                                                                            <p className="font-medium text-lg">{selectedEmergency.usedVolume} ml</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="bg-muted/50 p-4 rounded-lg">
                                                                <h3 className="text-lg font-semibold mb-3">Địa Điểm</h3>
                                                                <div className="flex items-start gap-2">
                                                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                                    <div>
                                                                        <p className="font-medium">{selectedEmergency.provinceName}</p>
                                                                        <p className="text-muted-foreground">
                                                                            {selectedEmergency.districtName}, {selectedEmergency.wardName}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="bg-muted/50 p-4 rounded-lg">
                                                                <h3 className="text-lg font-semibold mb-3">Ngày Tạo</h3>
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                    <p className="font-medium">{format(new Date(selectedEmergency.startDate), "dd/MM/yyyy")}</p>
                                                                </div>
                                                            </div>

                                                            {selectedEmergency.bloodUnit && (
                                                                <div className="bg-muted/50 p-4 rounded-lg">
                                                                    <h3 className="text-lg font-semibold mb-3">Thông Tin Đơn Vị Máu</h3>
                                                                    <div className="space-y-2">
                                                                        <div>
                                                                            <p className="text-sm text-muted-foreground">Mã Đơn Vị</p>
                                                                            <p className="font-medium">{selectedEmergency.bloodUnit.id || "Chưa được phân bổ"}</p>
                                                                        </div>
                                                                        {selectedEmergency.bloodUnit.donatedBy && (
                                                                            <div>
                                                                                <p className="text-sm text-muted-foreground">Người Hiến</p>
                                                                                <p className="font-medium">{selectedEmergency.bloodUnit.donatedBy.name || "Ẩn danh"}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <DialogFooter className="flex flex-row justify-end gap-3 pt-4">
                                                        {/* Only show update and delete if status is pending */}
                                                        {selectedEmergency?.status === "pending" && (
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
                                                                                    <Select name="bloodGroup" defaultValue={editingEmergency?.bloodType.group}>
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
                                                                                    <Select name="bloodRh" defaultValue={editingEmergency?.bloodType.rh}>
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

                                                                            <div className="space-y-2">
                                                                                <Label htmlFor="bloodTypeComponent">Thành Phần</Label>
                                                                                <Select name="bloodTypeComponent" defaultValue={editingEmergency?.bloodTypeComponent}>
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
                                                                                    defaultValue={editingEmergency?.requiredVolume}
                                                                                    min="1"
                                                                                />
                                                                            </div>

                                                                            <div className="grid grid-cols-3 gap-4">
                                                                                <div className="space-y-2">
                                                                                    <Label htmlFor="province">Tỉnh/Thành Phố</Label>
                                                                                    <Select
                                                                                        value={selectedProvinceId}
                                                                                        onValueChange={handleProvinceChange}
                                                                                        disabled={updateEmergencyMutation.isPending}
                                                                                    >
                                                                                        <SelectTrigger>
                                                                                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                            {isLoadingProvinces ? (
                                                                                                <SelectItem value="loading" disabled>Đang tải tỉnh/thành phố...</SelectItem>
                                                                                            ) : (
                                                                                                provinces?.map((province) => (
                                                                                                    <SelectItem key={province.id} value={province.id}>
                                                                                                        {province.name}
                                                                                                    </SelectItem>
                                                                                                ))
                                                                                            )}
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                </div>

                                                                                <div className="space-y-2">
                                                                                    <Label htmlFor="district">Quận/Huyện</Label>
                                                                                    <Select
                                                                                        value={selectedDistrictId}
                                                                                        onValueChange={handleDistrictChange}
                                                                                        disabled={!selectedProvinceId || updateEmergencyMutation.isPending}
                                                                                    >
                                                                                        <SelectTrigger>
                                                                                            <SelectValue placeholder={selectedProvinceId ? "Chọn quận/huyện" : "Chọn tỉnh/thành phố trước"} />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                            {isLoadingDistricts ? (
                                                                                                <SelectItem value="loading" disabled>Đang tải quận/huyện...</SelectItem>
                                                                                            ) : (
                                                                                                districts?.map((district) => (
                                                                                                    <SelectItem key={district.id} value={district.id}>
                                                                                                        {district.name}
                                                                                                    </SelectItem>
                                                                                                ))
                                                                                            )}
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                </div>

                                                                                <div className="space-y-2">
                                                                                    <Label htmlFor="ward">Phường/Xã</Label>
                                                                                    <Select
                                                                                        value={selectedWardId}
                                                                                        onValueChange={handleWardChange}
                                                                                        disabled={!selectedDistrictId || updateEmergencyMutation.isPending}
                                                                                    >
                                                                                        <SelectTrigger>
                                                                                            <SelectValue placeholder={selectedDistrictId ? "Chọn phường/xã" : "Chọn quận/huyện trước"} />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                            {isLoadingWards ? (
                                                                                                <SelectItem value="loading" disabled>Đang tải phường/xã...</SelectItem>
                                                                                            ) : (
                                                                                                wards?.map((ward) => (
                                                                                                    <SelectItem key={ward.id} value={ward.id}>
                                                                                                        {ward.name}
                                                                                                    </SelectItem>
                                                                                                ))
                                                                                            )}
                                                                                        </SelectContent>
                                                                                    </Select>
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
                                                                            onClick={() => {
                                                                                if (selectedEmergency) {
                                                                                    setEmergencyToDelete(selectedEmergency.id);
                                                                                    setIsDeleteDialogOpen(true);
                                                                                }
                                                                            }}
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
                                                                                onClick={() => {
                                                                                    handleDeleteEmergency();
                                                                                    setIsDetailDialogOpen(false);
                                                                                }}
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
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {data && data.meta && data.meta.totalPages > 1 && (
                                <div className="flex justify-center mt-8">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => data.meta.hasPreviousPage && handlePageChange(data.meta.page - 1)}
                                                    className={!data.meta.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                                                />
                                            </PaginationItem>

                                            {Array.from({ length: Math.min(5, data.meta.totalPages) }, (_, i) => {
                                                // Show current page and 2 pages before and after when possible
                                                const currentPage = data.meta.page;
                                                let pageToShow;

                                                if (data.meta.totalPages <= 5) {
                                                    pageToShow = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageToShow = i + 1;
                                                } else if (currentPage >= data.meta.totalPages - 2) {
                                                    pageToShow = data.meta.totalPages - 4 + i;
                                                } else {
                                                    pageToShow = currentPage - 2 + i;
                                                }

                                                return (
                                                    <PaginationItem key={pageToShow}>
                                                        <PaginationLink
                                                            onClick={() => handlePageChange(pageToShow)}
                                                            isActive={pageToShow === currentPage}
                                                        >
                                                            {pageToShow}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}

                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => data.meta.hasNextPage && handlePageChange(data.meta.page + 1)}
                                                    className={!data.meta.hasNextPage ? "pointer-events-none opacity-50" : ""}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default EmergencyList;