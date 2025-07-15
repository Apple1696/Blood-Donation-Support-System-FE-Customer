import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetEmergencyRequests } from "../../services/EmergencyService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../components/ui/pagination";
import { Loader2, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import type { EmergencyRequestFilters, EmergencyResponse } from "../../services/EmergencyService";
import { format } from "date-fns";

const EmergencyList: React.FC = () => {
    const navigate = useNavigate();
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

    const handleViewDetails = (id: string) => {
        navigate(`/emergency/${id}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200"><Clock className="h-3 w-3" /> Pending</Badge>;
            case 'approved':
                return <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3" /> Rejected</Badge>;
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
            'plasma': { label: 'Plasma', className: 'bg-blue-100 text-blue-800 border-blue-200' },
            'platelets': { label: 'Platelets', className: 'bg-purple-100 text-purple-800 border-purple-200' },
            'red_cells': { label: 'Red Cells', className: 'bg-red-100 text-red-800 border-red-200' },
            'whole_blood': { label: 'Whole Blood', className: 'bg-rose-100 text-rose-800 border-rose-200' },
        };

        const { label, className } = componentMap[component] || { label: component, className: '' };
        return <Badge variant="outline" className={className}>{label}</Badge>;
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Emergency Blood Requests</h1>
                    <p className="text-muted-foreground">View and manage emergency blood donation requests</p>
                </div>
                <Button className="mt-4 md:mt-0" variant="default">New Request</Button>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-lg p-4 mb-8 border">
                <h2 className="text-lg font-medium mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                            value={filters.status || "all"}
                            onValueChange={(value) => handleFilterChange('status', value === "all" ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Blood Group</label>
                        <Select
                            value={filters.bloodGroup || "all"}
                            onValueChange={(value) => handleFilterChange('bloodGroup', value === "all" ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Groups" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Groups</SelectItem>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="AB">AB</SelectItem>
                                <SelectItem value="O">O</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">RH Factor</label>
                        <Select
                            value={filters.bloodRh || "all"}
                            onValueChange={(value) => handleFilterChange('bloodRh', value === "all" ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All RH" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All RH</SelectItem>
                                <SelectItem value="+">Positive (+)</SelectItem>
                                <SelectItem value="-">Negative (-)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Component</label>
                        <Select
                            value={filters.bloodTypeComponent || "all"}
                            onValueChange={(value) => handleFilterChange('bloodTypeComponent', value === "all" ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Components" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Components</SelectItem>
                                <SelectItem value="plasma">Plasma</SelectItem>
                                <SelectItem value="platelets">Platelets</SelectItem>
                                <SelectItem value="red_cells">Red Cells</SelectItem>
                                <SelectItem value="whole_blood">Whole Blood</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center items-center p-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading emergency requests...</span>
                </div>
            ) : isError ? (
                <div className="flex justify-center items-center p-16 text-destructive">
                    <AlertCircle className="h-8 w-8" />
                    <span className="ml-2">Error loading emergency requests. Please try again.</span>
                </div>
            ) : (
                <>
                    {!data || !Array.isArray(data.data) || data.data.length === 0 ? (
                        <div className="text-center p-16">
                            <p className="text-muted-foreground">No emergency requests found matching your filters.</p>
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
                                                    <span className="text-sm text-muted-foreground">Component:</span>
                                                    <span>{getComponentBadge(emergency.bloodTypeComponent)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Required:</span>
                                                    <span className="font-medium">{emergency.requiredVolume} ml</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Location:</span>
                                                    <span className="text-right text-sm">{emergency.wardName}, {emergency.districtName}, {emergency.provinceName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Date:</span>
                                                    <span className="text-right text-sm">
                                                        {format(new Date(emergency.startDate), "MMM d, yyyy")}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-2 flex justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(emergency.id)}
                                            >
                                                View Details
                                            </Button>                                        </CardFooter>
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