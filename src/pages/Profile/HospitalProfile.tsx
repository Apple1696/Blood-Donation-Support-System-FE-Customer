import { useAuthContext } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { ProfileService } from "@/services/ProfileService";
import { AddressService } from "@/services/AddressService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const HospitalProfile = () => {
  const { isAuthenticated, getToken } = useAuthContext();
  const [isTokenAvailable, setIsTokenAvailable] = useState(false);

  // Check token availability
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken();
        setIsTokenAvailable(!!token);
      } catch (error) {
        setIsTokenAvailable(false);
      }
    };
    if (isAuthenticated) {
      checkToken();
    } else {
      setIsTokenAvailable(false);
    }
  }, [isAuthenticated, getToken]);

  // Fetch hospital profile
  const { data: profile, isLoading, error } = ProfileService.useHospitalProfile(isAuthenticated, isTokenAvailable);

  // Editable state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  // Avatar upload state
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Address queries
  const { data: provinces } = AddressService.useProvinces();
  const { data: districts } = AddressService.useDistricts(selectedProvinceId);
  const { data: wards } = AddressService.useWards(selectedDistrictId);

  // React Query mutations
  const updateHospitalProfileMutation = ProfileService.useUpdateHospitalProfile(
    () => toast.success("Cập nhật hồ sơ bệnh viện thành công"),
    (error) => toast.error("Không thể cập nhật hồ sơ bệnh viện: " + error.message)
  );

  // Image upload mutation
  const uploadImageMutation = ProfileService.useUploadImage(
    async (data) => {
      // After successful image upload, update hospital avatar with the URL
      try {
        await ProfileService.updateHospitalAvatar({ avatar: data.imageUrl });
        toast.success("Cập nhật ảnh đại diện bệnh viện thành công");
        setIsUploadDialogOpen(false);
        setSelectedImage(null);
        setPreviewUrl(null);
        // Invalidate the hospital profile query to refresh the data
        window.location.reload(); // Simple refresh, or use queryClient.invalidateQueries
      } catch (error) {
        toast.error("Không thể cập nhật ảnh đại diện: " + (error as Error).message);
      }
    },
    (error) => toast.error("Không thể tải ảnh lên: " + error.message)
  );

  // Dropzone setup
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
      setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    maxFiles: 1
  });

  // Set initial values when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setSelectedProvinceId(profile.provinceCode || "");
      setSelectedDistrictId(profile.districtCode || "");
      setSelectedWardId(profile.wardCode || "");
      setLongitude(profile.longitude || "");
      setLatitude(profile.latitude || "");
    }
  }, [profile]);

  // Keep address names in sync with selected codes
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  useEffect(() => {
    const province = provinces?.find(p => p.id === selectedProvinceId);
    setProvinceName(province?.name || profile?.provinceName || "");
  }, [selectedProvinceId, provinces, profile]);

  useEffect(() => {
    const district = districts?.find(d => d.id === selectedDistrictId);
    setDistrictName(district?.name || profile?.districtName || "");
  }, [selectedDistrictId, districts, profile]);

  useEffect(() => {
    const ward = wards?.find(w => w.id === selectedWardId);
    setWardName(ward?.name || profile?.wardName || "");
  }, [selectedWardId, wards, profile]);

  // Update longitude/latitude when ward changes
  useEffect(() => {
    if (selectedWardId && wards) {
      const ward = wards.find(w => w.id === selectedWardId);
      if (ward) {
        setLongitude(ward.longitude);
        setLatitude(ward.latitude);
      }
    }
  }, [selectedWardId, wards]);

  // Handlers for address selection
  const handleProvinceChange = (value: string) => {
    setSelectedProvinceId(value);
    setSelectedDistrictId("");
    setSelectedWardId("");
  };
  const handleDistrictChange = (value: string) => {
    setSelectedDistrictId(value);
    setSelectedWardId("");
  };
  const handleWardChange = (value: string) => {
    setSelectedWardId(value);
    // longitude/latitude will update via useEffect
  };

  // Save changes
  const handleSaveChanges = () => {
    if (!selectedProvinceId || !selectedDistrictId || !selectedWardId) {
      toast.error("Vui lòng chọn đầy đủ thông tin địa chỉ");
      return;
    }
    const selectedProvince = provinces?.find(p => p.id === selectedProvinceId);
    const selectedDistrict = districts?.find(d => d.id === selectedDistrictId);
    const selectedWard = wards?.find(w => w.id === selectedWardId);
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error("Lựa chọn địa chỉ không hợp lệ");
      return;
    }
    updateHospitalProfileMutation.mutate({
      name,
      phone,
      longitude: selectedWard.longitude,
      latitude: selectedWard.latitude,
      wardCode: selectedWard.id,
      wardName: selectedWard.name,
      districtCode: selectedDistrict.id,
      districtName: selectedDistrict.name,
      provinceCode: selectedProvince.id,
      provinceName: selectedProvince.name,
    });
  };

  // Handle avatar upload
  const handleAvatarUpload = () => {
    if (selectedImage) {
      uploadImageMutation.mutate(selectedImage);
    } else {
      toast.error("Vui lòng chọn ảnh để tải lên");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Vui lòng đăng nhập để xem hồ sơ bệnh viện</h1>
      </div>
    );
  }
  if (!isTokenAvailable) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Đang xác thực...</h1>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Đang tải hồ sơ bệnh viện...</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6 text-destructive">Lỗi khi tải hồ sơ bệnh viện</h1>
        <p className="text-muted-foreground">Vui lòng thử làm mới trang</p>
      </div>
    );
  }
  if (!profile) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Hồ Sơ Bệnh Viện</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold mb-2">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              name[0]?.toUpperCase() || "H"
            )}
          </div>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-sm text-gray-500">{profile?.account.email}</div>
          {/* Avatar upload button */}
          {/* <Button
            className="mt-2"
            variant="outline"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            Tải ảnh đại diện bệnh viện
          </Button> */}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium">Tên bệnh viện</label>
            <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Số điện thoại</label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1" />
          </div>
          {/* Address row: Province, District, Ward */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Tỉnh/Thành phố</label>
              <Select value={selectedProvinceId} onValueChange={handleProvinceChange}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {provinces?.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-gray-500 mt-1">Tên: {provinceName}</div>
            </div>
            <div>
              <label className="text-sm font-medium">Quận/Huyện</label>
              <Select value={selectedDistrictId} onValueChange={handleDistrictChange} disabled={!selectedProvinceId}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts?.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-gray-500 mt-1">Tên: {districtName}</div>
            </div>
            <div>
              <label className="text-sm font-medium">Phường/Xã</label>
              <Select value={selectedWardId} onValueChange={handleWardChange} disabled={!selectedDistrictId}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  {wards?.map((ward) => (
                    <SelectItem key={ward.id} value={ward.id}>
                      {ward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-gray-500 mt-1">Tên: {wardName}</div>
            </div>
          </div>
          {/* Lat/Lng row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Kinh độ</label>
              <Input value={longitude} readOnly className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Vĩ độ</label>
              <Input value={latitude} readOnly className="mt-1" />
            </div>
          </div>
          <div>
            <span className="font-medium">Trạng thái:</span> {profile?.status}
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSaveChanges} disabled={updateHospitalProfileMutation.isPending}>
            {updateHospitalProfileMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      {/* Avatar upload dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Ảnh Đại Diện Bệnh Viện</DialogTitle>
            <DialogDescription>
              Chọn ảnh từ máy tính của bạn để làm ảnh đại diện bệnh viện.
            </DialogDescription>
          </DialogHeader>
          <div {...getRootProps()} className="border-dashed border-2 border-gray-300 rounded-md p-4 flex flex-col items-center cursor-pointer mb-4">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Kéo và thả ảnh vào đây...</p>
            ) : (
              <p>Nhấn hoặc kéo thả ảnh vào đây để chọn ảnh</p>
            )}
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-full" />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadDialogOpen(false);
                setSelectedImage(null);
                setPreviewUrl(null);
              }}
              disabled={uploadImageMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleAvatarUpload}
              disabled={!selectedImage || uploadImageMutation.isPending}
            >
              {uploadImageMutation.isPending ? "Đang tải lên..." : "Tải lên"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalProfile;