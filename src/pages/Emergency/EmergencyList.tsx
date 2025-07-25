import { format } from "date-fns";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGetEmergencyRequests } from "../../services/EmergencyService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import { Loader2, AlertCircle, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import type { EmergencyRequestFilters, EmergencyResponse } from "../../services/EmergencyService";
import EmergencyDetail from "./EmergencyDetail";

const EmergencyList: React.FC = () => {
    const navigate = useNavigate();
    const [selectedEmergency, setSelectedEmergency] = useState<EmergencyResponse | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    const [filters, setFilters] = useState<EmergencyRequestFilters>({
        page: 1,
        limit: 8,
        status: undefined,
        bloodGroup: undefined,
        bloodRh: undefined,
        bloodTypeComponent: undefined,
    });

    const { data, isLoading, isError } = useGetEmergencyRequests(filters);

    const handleFilterChange = (key: keyof EmergencyRequestFilters, value: string | number | undefined) => {
        // If value is "all", set to undefined instead of empty string
        setFilters(prev => ({ ...prev, [key]: value === "all" ? undefined : value, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
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

    const handleDetailClick = (emergency: EmergencyResponse) => {
        setSelectedEmergency(emergency);
        setIsDetailDialogOpen(true);
    };

    const handleCloseDetail = () => {
        setSelectedEmergency(null);
        setIsDetailDialogOpen(false);
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
                                <SelectItem value="expired">Đã hết hạn</SelectItem>
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
                                            {selectedEmergency?.id === emergency.id ? (
                                                <EmergencyDetail
                                                    emergency={emergency}
                                                    isOpen={isDetailDialogOpen}
                                                    onClose={handleCloseDetail}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDetailClick(emergency)}
                                                        className="w-full"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Chi Tiết
                                                    </Button>
                                                </EmergencyDetail>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDetailClick(emergency)}
                                                    className="w-full"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Chi Tiết
                                                </Button>
                                            )}
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