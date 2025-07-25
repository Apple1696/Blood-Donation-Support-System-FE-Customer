import { useState } from "react";
import { Bell } from "lucide-react";
import { useGetMyActiveReminders, useGetMyReminders } from "@/services/ReminderService";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Status label mapping and badge color mapping
const statusLabels: Record<string, string> = {
    completed: "Đã hoàn thành",
    pending: "Chờ xác nhận",
    rejected: "Bị từ chối",
    result_returned: "Đã có kết quả",
    appointment_confirmed: "Đã xác nhận lịch hẹn",
    appointment_absent: "Vắng mặt",
    customer_cancelled: "Đã hủy",
    customer_checked_in: "Đã check-in",
};

const statusVariants: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    result_returned: "bg-purple-100 text-purple-800",
    appointment_confirmed: "bg-blue-100 text-blue-800",
    appointment_absent: "bg-gray-100 text-gray-800",
    customer_cancelled: "bg-red-100 text-red-800",
    customer_checked_in: "bg-indigo-100 text-indigo-800",
};

export const ReminderSheet = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: activeReminders, isLoading } = useGetMyActiveReminders();
    const { data: allReminders } = useGetMyReminders({ filter: 'all' });
    const { data: beforeReminders } = useGetMyReminders({ filter: 'before_donation' });
    const { data: afterReminders } = useGetMyReminders({ filter: 'after_donation' });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderReminderCard = (reminder: any, showCampaignInfo: boolean = false) => (
        <Card key={reminder.id} className="mb-3">
            <CardContent className="p-4">
                <div className="space-y-3">
                    {/* Message - Priority emphasis */}
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                        <p className="text-sm font-medium text-blue-900">{reminder.message}</p>
                    </div>

                    {/* Campaign Name - Always emphasized */}
                    {(showCampaignInfo && reminder.campaignDonation) && (
                        <div className="p-2 bg-gray-50 rounded-md">
                            <p className="text-sm"><strong>Chiến dịch:</strong> {reminder.campaignDonation.campaign.name}</p>
                        </div>
                    )}

                    {/* After donation specific info */}
                    {reminder.type === 'after_donation' && 'donationDate' in reminder.metadata && (
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-green-50 rounded-md border border-green-200">
                                <p className="text-xs font-medium text-green-800">Ngày hiến máu:</p>
                                <p className="text-sm font-bold text-green-900">
                                    {formatDate(reminder.metadata.donationDate)}
                                </p>
                            </div>
                            {'nextEligibleDate' in reminder.metadata && (
                                <div className="p-2 bg-orange-50 rounded-md border border-orange-200">
                                    <p className="text-xs font-medium text-orange-800">Ngày có thể hiến tiếp:</p>
                                    <p className="text-sm font-bold text-orange-900">
                                        {formatDate(reminder.metadata.nextEligibleDate)}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                        {formatDate(reminder.createdAt)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                    <Bell className="size-4" />
                </button>
            </SheetTrigger>
            <SheetContent className="w-[60vw] min-w-[600px] overflow-y-auto">
                <SheetHeader className="mb-6 px-6">
                    <SheetTitle>Nhắc nhở hiến máu</SheetTitle>
                </SheetHeader>

                <div className="px-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-muted-foreground">Đang tải...</div>
                        </div>
                    ) : activeReminders?.data ? (
                        <div className="space-y-8">
                            {/* Section Title */}
                            <h2 className="text-xl font-semibold mb-2 text-primary">Nhắc nhở gần đây</h2>
                            {/* Campaign Card */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-2 gap-4 items-start">
                                        {/* Campaign Info */}
                                        <div className="space-y-3">
                                            {/* Status Badge above campaign name */}
                                            <div className="mb-1">
                                                <Badge className={
                                                    statusVariants[activeReminders.data.campaignDonation.currentStatus] || "bg-gray-100 text-gray-800"
                                                }>
                                                    {statusLabels[activeReminders.data.campaignDonation.currentStatus] ||
                                                        activeReminders.data.campaignDonation.currentStatus}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-lg">{activeReminders.data.campaignDonation.campaign.name}</CardTitle>
                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <p>
                                                    <strong>Địa điểm:</strong> {activeReminders.data.campaignDonation.campaign.location}
                                                </p>
                                                <p>
                                                    <strong>Ngày hẹn:</strong> {formatDate(activeReminders.data.campaignDonation.appointmentDate)}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Campaign Banner */}
                                        <div>
                                            <img
                                                src={activeReminders.data.campaignDonation.campaign.banner}
                                                alt={activeReminders.data.campaignDonation.campaign.name}
                                                className="w-full h-32 object-cover rounded-md"
                                            />
                                        </div>
                                    </div>
                                    {/* Emphasized message below campaign info */}
                                    {activeReminders.data.reminders?.[0]?.message && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                                            <p className="text-sm font-medium text-blue-900">
                                                {activeReminders.data.reminders[0].message}
                                            </p>
                                        </div>
                                    )}
                                    {/* After donation specific info below the message */}
                                    {activeReminders.data.reminders?.[0]?.type === "after_donation" &&
                                        "donationDate" in activeReminders.data.reminders[0].metadata && (
                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                <div className="p-2 bg-green-50 rounded-md border border-green-200">
                                                    <p className="text-xs font-medium text-green-800">Ngày hiến máu:</p>
                                                    <p className="text-sm font-bold text-green-900">
                                                        {formatDate(activeReminders.data.reminders[0].metadata.donationDate)}
                                                    </p>
                                                </div>
                                                {"nextEligibleDate" in activeReminders.data.reminders[0].metadata && (
                                                    <div className="p-2 bg-orange-50 rounded-md border border-orange-200">
                                                        <p className="text-xs font-medium text-orange-800">Ngày có thể hiến tiếp:</p>
                                                        <p className="text-sm font-bold text-orange-900">
                                                            {formatDate(activeReminders.data.reminders[0].metadata.nextEligibleDate)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                </CardContent>
                            </Card>

                            {/* Reminders Tabs Section Title */}
                            <h2 className="text-xl font-semibold mb-2 mt-8 text-primary">Lịch sử nhắc nhở</h2>
                            {/* Reminders Tabs */}
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                                    <TabsTrigger value="before_donation">Chuẩn bị</TabsTrigger>
                                    <TabsTrigger value="after_donation">Sau hiến máu</TabsTrigger>
                                </TabsList>

                                <TabsContent value="all" className="mt-4">
                                    <div className="space-y-2">
                                        {allReminders?.data?.items?.length ? (
                                            allReminders.data.items.map((reminder) => renderReminderCard(reminder, true))
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <p>Không có nhắc nhở nào</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="before_donation" className="mt-4">
                                    <div className="space-y-2">
                                        {beforeReminders?.data?.items?.length ? (
                                            beforeReminders.data.items.map((reminder) => renderReminderCard(reminder, true))
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <p>Không có nhắc nhở chuẩn bị nào</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="after_donation" className="mt-4">
                                    <div className="space-y-2">
                                        {afterReminders?.data?.items?.length ? (
                                            afterReminders.data.items.map((reminder) => renderReminderCard(reminder, true))
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <p>Không có nhắc nhở sau hiến máu nào</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Bell className="size-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Không có nhắc nhở nào</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Bạn chưa có chiến dịch hiến máu nào gần đây
                            </p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

// Main Reminder page component
const Reminder = () => {
    const { data: reminders, isLoading } = useGetMyReminders();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Nhắc nhở hiến máu</h1>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Đang tải...</div>
                </div>
            ) : reminders?.data?.items?.length ? (
                <div className="space-y-4">
                    {reminders.data.items.map((reminder) => (
                        <Card key={reminder.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {reminder.type === 'before_donation' ? '🔔' : '✅'}
                                    {reminder.type === 'before_donation' ? 'Chuẩn bị hiến máu' : 'Sau khi hiến máu'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-sm">{reminder.message}</p>

                                    {reminder.campaignDonation && (
                                        <div className="p-4 bg-gray-50 rounded-md">
                                            <h4 className="font-medium mb-2">Thông tin chiến dịch:</h4>
                                            <p className="text-sm"><strong>Tên:</strong> {reminder.campaignDonation.campaign.name}</p>
                                            <p className="text-sm"><strong>Địa điểm:</strong> {reminder.campaignDonation.campaign.location}</p>
                                            <p className="text-sm"><strong>Ngày hẹn:</strong> {formatDate(reminder.campaignDonation.appointmentDate)}</p>
                                        </div>
                                    )}

                                    {reminder.type === 'after_donation' && 'nextEligibleDate' in reminder.metadata && (
                                        <div className="p-3 bg-green-50 rounded-md border border-green-200">
                                            <p className="text-sm font-medium text-green-800">
                                                Ngày có thể hiến máu tiếp theo:
                                            </p>
                                            <p className="text-sm text-green-700">
                                                {formatDate(reminder.metadata.nextEligibleDate)}
                                            </p>
                                        </div>
                                    )}

                                    <div className="text-xs text-muted-foreground">
                                        {formatDate(reminder.createdAt)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Bell className="size-16 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Không có nhắc nhở nào</h2>
                    <p className="text-muted-foreground">
                        Bạn chưa có nhắc nhở hiến máu nào. Hãy tham gia các chiến dịch để nhận được thông báo!
                    </p>
                </div>
            )}
        </div>
    );
};

export default Reminder;