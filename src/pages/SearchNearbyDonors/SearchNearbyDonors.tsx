import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MapPin, Calendar, Heart, Search, Users, AlertCircle, Map, List } from 'lucide-react';
import { ProfileService } from '@/services/ProfileService';
import { Loader2 } from 'lucide-react';
// Replace the shadcn/ui toast import with sonner
import { toast } from 'sonner';
import DonorMap from '@/components/DonorMap';

const BloodDonationSearch = () => {
  const [searchParams, setSearchParams] = useState({
    bloodGroup: '',
    bloodRh: '',
    radius: [50]
  });

  const [searchEnabled, setSearchEnabled] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Use the React Query hook from ProfileService
  const {
    data: results,
    isLoading,
    isError,
    error
  } = ProfileService.useFindNearbyDonors(
    searchParams.bloodGroup && searchParams.bloodRh ? {
      radius: searchParams.radius[0],
      bloodRh: searchParams.bloodRh as "+" | "-",
      bloodGroup: searchParams.bloodGroup as "A" | "B" | "AB" | "O"
    } : null,
    searchEnabled
  );

  // Show error toast when search fails
  useEffect(() => {
    if (isError && error) {
      // Replace with sonner toast
      toast.error("Tìm kiếm thất bại", {
        description: error instanceof Error ? error.message : "Không thể tìm thấy người hiến máu"
      });
      setSearchEnabled(false);
    }
  }, [isError, error]);

  // Format last donation date
  const formatLastDonation = (date: string | null) => {
    if (!date) return { text: 'Chưa từng hiến máu', highlight: false };

    const donationDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - donationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let text = '';

    if (diffDays < 30) {
      text = `${diffDays} ngày trước`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      text = `${months} tháng trước`;
    } else {
      const years = Math.floor(diffDays / 365);
      text = `${years} năm trước`;
    }

    return { text, highlight: diffDays < 90 }; // Highlight recent donations (less than 90 days)
  };

  // Get blood type color
  const getBloodTypeColor = (group: string, rh: string) => {
    const colors = {
      'A': 'bg-red-100 text-red-800',
      'B': 'bg-blue-100 text-blue-800',
      'AB': 'bg-purple-100 text-purple-800',
      'O': 'bg-green-100 text-green-800'
    };
    return colors[group] || 'bg-gray-100 text-gray-800';
  };

  // Check if user can donate soon (90+ days since last donation)
  const canDonateSoon = (lastDonationDate: string | null) => {
    if (!lastDonationDate) return true;
    const donationDate = new Date(lastDonationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - donationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 90;
  };

  const handleSearch = () => {
    // Validate all required fields are present
    if (!searchParams.bloodGroup) {
      // Replace with sonner toast for validation
      toast.error("Thiếu nhóm máu", {
        description: "Vui lòng chọn nhóm máu trước khi tìm kiếm"
      });
      return;
    }

    if (!searchParams.bloodRh) {
      // Replace with sonner toast for validation
      toast.error("Thiếu yếu tố Rh", {
        description: "Vui lòng chọn yếu tố Rh trước khi tìm kiếm"
      });
      return;
    }

    // If all validations pass, enable the search
    setSearchEnabled(true);
  };

  const handleResetFilters = () => {
    setSearchParams({
      bloodGroup: '',
      bloodRh: '',
      radius: [50]
    });
    setSearchEnabled(false);
    setViewMode('list');
  };

  // Get Google Maps API key from environment variables
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="min-h-screen pt-20 px-4 pb-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2 text-primary">
            Tìm Người Hiến Máu Gần Bạn
          </h1>
          <p className="text-gray-600">Kết nối với những người hiến máu có nhóm máu phù hợp trong khu vực của bạn</p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Search className="h-5 w-5" />
              Bộ Lọc Tìm Kiếm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nhóm Máu</label>
                <Select value={searchParams.bloodGroup} onValueChange={(value) =>
                  setSearchParams({ ...searchParams, bloodGroup: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhóm máu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="AB">AB</SelectItem>
                    <SelectItem value="O">O</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Yếu Tố Rh</label>
                <Select value={searchParams.bloodRh} onValueChange={(value) =>
                  setSearchParams({ ...searchParams, bloodRh: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn yếu tố Rh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+">Dương tính (+)</SelectItem>
                    <SelectItem value="-">Âm tính (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bán Kính Tìm Kiếm</label>
                <div className="px-2">
                  <Slider
                    value={searchParams.radius}
                    onValueChange={(value) => setSearchParams({ ...searchParams, radius: value })}
                    max={100}
                    min={5}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5km</span>
                    <span className="font-medium">{searchParams.radius[0]}km</span>
                    <span>100km</span>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full md:w-auto" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              {isLoading ? 'Đang tìm kiếm...' : 'Tìm Người Hiến Máu'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchEnabled && (
          <>
            {/* Results Summary */}
            {!isLoading && results && (
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="text-lg font-medium">
                    Tìm thấy {results.count} người hiến máu
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    disabled={!googleMapsApiKey || googleMapsApiKey === 'your_google_maps_api_key_here'}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Xem trên bản đồ
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Xem danh sách
                  </Button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <Card className="text-center py-12 mb-6">
                <CardContent>
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Đang tìm kiếm người hiến máu</h3>
                  <p className="text-gray-500">Đang tìm những người hiến máu phù hợp gần bạn...</p>
                </CardContent>
              </Card>
            )}

            {/* Results Grid */}
            {!isLoading && results && results.count > 0 && (
              <>
                {/* Map View */}
                {viewMode === 'map' && (
                  <>
                    {!googleMapsApiKey || googleMapsApiKey === 'your_google_maps_api_key_here' ? (
                      <Card className="text-center py-12 border-yellow-200 bg-yellow-50">
                        <CardContent>
                          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Cần cấu hình Google Maps API</h3>
                          <p className="text-gray-600 mb-4">
                            Để sử dụng tính năng bản đồ, vui lòng cấu hình Google Maps API key trong file .env:
                          </p>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
                          </code>
                          <p className="text-sm text-gray-500 mt-2">
                            Lấy API key tại: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Google Cloud Console</a>
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <DonorMap
                        donors={results.customers}
                        apiKey={googleMapsApiKey}
                        zoom={11}
                      />
                    )}
                  </>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.customers.map((user) => (
                      <Card key={user.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          {/* Blood Type Badge */}
                          <div className="flex justify-between items-start mb-4">
                            <Badge className={`${getBloodTypeColor(user.bloodType.group, user.bloodType.rh)} text-lg font-bold px-3 py-1`}>
                              {user.bloodType.group}{user.bloodType.rh}
                            </Badge>
                            {canDonateSoon(user.lastDonationDate) && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Có thể hiến
                              </Badge>
                            )}
                          </div>

                          {/* User Info */}
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
                              <p className="text-sm text-gray-500 capitalize">
                                {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Không xác định'}
                              </p>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{user.districtName || 'Không xác định'}, {user.provinceName || 'Không xác định'}</span>
                            </div>

                            {/* Last Donation - Enhanced and Emphasized */}
                            <div className={`flex items-center gap-2 p-3 rounded-md ${formatLastDonation(user.lastDonationDate).highlight
                                ? 'bg-primary/10 text-primary font-medium border-l-4 border-primary'
                                : 'border border-muted'
                              }`}>
                              <Calendar className="h-5 w-5" />
                              <div>
                                <div className="text-xs text-muted-foreground">Lần hiến máu cuối</div>
                                <div className="font-semibold">{formatLastDonation(user.lastDonationDate).text}</div>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          {/* <Button className="w-full mt-4" variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            Liên hệ người hiến máu
                          </Button> */}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!isLoading && results && results.count === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy người hiến máu</h3>
                  <p className="text-gray-500 mb-4">Thử điều chỉnh tiêu chí tìm kiếm hoặc mở rộng bán kính tìm kiếm</p>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Đặt lại bộ lọc
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {isError && (
              <Card className="text-center py-12 border-red-200">
                <CardContent>
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tìm kiếm thất bại</h3>
                  <p className="text-gray-500 mb-4">
                    {error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại."}
                  </p>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Đặt lại bộ lọc
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BloodDonationSearch;