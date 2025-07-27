import { useAuthContext } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressService } from "@/services/AddressService";
import { ProfileService } from "@/services/ProfileService";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";

const Profile = () => {
  const { isAuthenticated, getToken } = useAuthContext();
  const { user } = useUser();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedWardId, setSelectedWardId] = useState<string>("");
  const [isTokenAvailable, setIsTokenAvailable] = useState(false);

  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string | null>(null);
  const [selectedBloodRh, setSelectedBloodRh] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Function to handle opening the phone change dialog
  const handleOpenPhoneDialog = () => {
    setNewPhone(profile?.phone || "");
    setIsPhoneDialogOpen(true);
  };

  // React Query hook for uploading image
  const uploadImageMutation = ProfileService.useUploadImage(
    (data) => {
      // After successful upload, update avatar
      updateAvatarMutation.mutate({ avatarUrl: data.imageUrl });
      toast.success("Tải ảnh lên thành công");
      setIsUploadDialogOpen(false);
      setSelectedImage(null);
      setPreviewUrl(null);
    },
    (error) => {
      toast.error("Không thể tải ảnh lên: " + error.message);
    }
  );

  // React Query hook for updating avatar
  const updateAvatarMutation = ProfileService.useUpdateAvatar(
    () => toast.success("Cập nhật ảnh đại diện thành công"),
    (error) => toast.error("Không thể cập nhật ảnh đại diện: " + error.message)
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

  // Function to handle phone number update
  const handleUpdatePhone = async () => {
    if (!newPhone.trim()) {
      toast.error("Số điện thoại không được để trống");
      return;
    }

    setIsChangingPhone(true);

    try {
      await updateProfileMutation.mutateAsync({
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        phone: newPhone,
        longitude: profile?.longitude || "",
        latitude: profile?.latitude || "",
        wardCode: profile?.wardCode || "",
        districtCode: profile?.districtCode || "",
        provinceCode: profile?.provinceCode || "",
        wardName: profile?.wardName || "",
        districtName: profile?.districtName || "",
        provinceName: profile?.provinceName || "",
        bloodGroup: selectedBloodGroup,
        bloodRh: selectedBloodRh,
        gender: profile?.gender || "",
        dateOfBirth: profile?.dateOfBirth || "",
        citizenId: profile?.citizenId || "",
      });

      // Close the dialog on success
      setIsPhoneDialogOpen(false);
      toast.success("Cập nhật số điện thoại thành công");
    } catch (error) {
      toast.error("Không thể cập nhật số điện thoại");
      console.error("Error updating phone:", error);
    } finally {
      setIsChangingPhone(false);
    }
  };

  // Check token availability
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken();
        setIsTokenAvailable(!!token);
      } catch (error) {
        console.error('Error checking token:', error);
        setIsTokenAvailable(false);
      }
    };

    if (isAuthenticated) {
      checkToken();
    } else {
      setIsTokenAvailable(false);
    }
  }, [isAuthenticated, getToken]);

  // Use the new profile hook
  const { data: profile, isLoading: isLoadingProfile, error: profileError } =
    ProfileService.useProfile(isAuthenticated, isTokenAvailable);

  // Use the new update profile mutation hook
  const updateProfileMutation = ProfileService.useUpdateProfile(
    // onSuccess callback
    () => toast.success("Hồ sơ đã được cập nhật thành công"),
    // onError callback
    (error) => toast.error("Không thể cập nhật hồ sơ: " + error.message)
  );

  // Using the query hooks from AddressService
  const { data: provinces, isLoading: isLoadingProvinces } = AddressService.useProvinces();
  const { data: districts, isLoading: isLoadingDistricts } = AddressService.useDistricts(selectedProvinceId);
  const { data: wards, isLoading: isLoadingWards } = AddressService.useWards(selectedDistrictId);

  // Set initial values when profile is loaded
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");

      // Set blood type if available
      if (profile.bloodType) {
        setSelectedBloodGroup(profile.bloodType.group);
        setSelectedBloodRh(profile.bloodType.rh);
      } else {
        setSelectedBloodGroup(null);
        setSelectedBloodRh(null);
      }

      // Set province and trigger district fetch
      if (profile.provinceCode) {
        setSelectedProvinceId(profile.provinceCode);
      }
    }
  }, [profile]);


  // Set district when province is loaded and matches profile
  useEffect(() => {
    if (profile?.districtCode && districts) {
      // Only set district if it exists in the current province
      const districtExists = districts.some(d => d.id === profile.districtCode);
      if (districtExists) {
        setSelectedDistrictId(profile.districtCode);
      }
    }
  }, [profile?.districtCode, districts]);

  // Set ward when district is loaded and matches profile
  useEffect(() => {
    if (profile?.wardCode && wards) {
      // Only set ward if it exists in the current district
      const wardExists = wards.some(w => w.id === profile.wardCode);
      if (wardExists) {
        setSelectedWardId(profile.wardCode);
      }
    }
  }, [profile?.wardCode, wards]);

  // Handle selection changes
  const handleProvinceChange = (value: string) => {
    setSelectedProvinceId(value);
    setSelectedDistrictId(""); // Reset district when province changes
    setSelectedWardId(""); // Reset ward when province changes
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrictId(value);
    setSelectedWardId(""); // Reset ward when district changes
  };

  const handleWardChange = (value: string) => {
    const selectedWard = wards?.find(w => w.id === value);
    if (selectedWard) {
      setSelectedWardId(value);
      // Update profile with new ward's coordinates
      updateProfileMutation.mutate({
        firstName,
        lastName,
        phone: profile?.phone || "",
        longitude: selectedWard.longitude,
        latitude: selectedWard.latitude,
        wardCode: value,
        districtCode: selectedDistrictId,
        provinceCode: selectedProvinceId,
        wardName: selectedWard.name,
        districtName: districts?.find(d => d.id === selectedDistrictId)?.name || "",
        provinceName: provinces?.find(p => p.id === selectedProvinceId)?.name || "",
        bloodGroup: selectedBloodGroup,
        bloodRh: selectedBloodRh,
        gender: profile?.gender || "",
        dateOfBirth: profile?.dateOfBirth || "",
        citizenId: profile?.citizenId || "",
      });
    }
  };


  const handleSaveChanges = () => {
    if (!selectedWardId || !selectedDistrictId || !selectedProvinceId) {
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

    updateProfileMutation.mutate({
      firstName,
      lastName,
      phone: profile?.phone || "",
      longitude: selectedWard.longitude,
      latitude: selectedWard.latitude,
      wardCode: selectedWardId,
      districtCode: selectedDistrictId,
      provinceCode: selectedProvinceId,
      wardName: selectedWard.name,
      districtName: selectedDistrict.name,
      provinceName: selectedProvince.name,
      bloodGroup: selectedBloodGroup,
      bloodRh: selectedBloodRh,
      gender: profile?.gender || "",
      dateOfBirth: profile?.dateOfBirth || "",
      citizenId: profile?.citizenId || "",
    });
  };


  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Vui lòng đăng nhập để xem hồ sơ của bạn</h1>
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

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Đang tải hồ sơ...</h1>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6 text-destructive">Lỗi khi tải hồ sơ</h1>
        <p className="text-muted-foreground">Vui lòng thử làm mới trang</p>
      </div>
    );
  }

  if (!profile || !user) return null;

  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`
    : profile.account.email[0].toUpperCase();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Hồ Sơ Của Tôi</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              {/* Use avatar from profile if available, fallback to user.imageUrl */}
              <AvatarImage src={profile.avatar || user.imageUrl} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <Button
              className="mt-2"
              variant="outline"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              Tải ảnh lên
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Họ</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tên</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="text-sm font-medium">Tỉnh/Thành phố</label>
              <Select value={selectedProvinceId} onValueChange={handleProvinceChange}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingProvinces ? (
                    <SelectItem value="loading">Đang tải dữ liệu...</SelectItem>
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
            <div>
              <label className="text-sm font-medium">Quận/Huyện</label>
              <Select
                value={selectedDistrictId}
                onValueChange={handleDistrictChange}
                disabled={!selectedProvinceId}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingDistricts ? (
                    <SelectItem value="loading">Đang tải dữ liệu...</SelectItem>
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
            <div>
              <label className="text-sm font-medium">Phường/Xã</label>
              <Select
                value={selectedWardId}
                onValueChange={handleWardChange}
                disabled={!selectedDistrictId}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingWards ? (
                    <SelectItem value="loading">Đang tải dữ liệu...</SelectItem>
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

          <div className="mt-6">
            <label className="text-sm font-medium">Nhóm máu</label>
            <div className="flex gap-4 mt-1">
              <Select
                value={selectedBloodGroup || "unknown"}
                onValueChange={(value) => {
                  if (profile && profile.canChangeBloodType === false) return; // Prevent change if not allowed
                  if (value === "unknown") {
                    setSelectedBloodGroup(null);
                    setSelectedBloodRh(null);
                  } else {
                    setSelectedBloodGroup(value);
                  }
                }}
                disabled={profile && profile.canChangeBloodType === false}              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Nhóm máu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">Chưa xác định</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="AB">AB</SelectItem>
                  <SelectItem value="O">O</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedBloodRh || "unknown"}
                onValueChange={(value) => {
                  if (profile && profile.canChangeBloodType === false) return; // Prevent change if not allowed
                  setSelectedBloodRh(value === "unknown" ? null : value);
                }}
                disabled={!selectedBloodGroup || (profile && profile.canChangeBloodType === false)}              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Yếu tố Rh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">Chưa xác định</SelectItem>
                  <SelectItem value="+">Dương (+)</SelectItem>
                  <SelectItem value="-">Âm (-)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-primary">
              Lưu ý: Sau khi chúng tôi đã xác định được nhóm máu của bạn, bạn sẽ không đc chỉnh sửa nhóm máu nữa
            </p>
          </div>

        </CardContent>
        <div className="flex justify-end px-6 pb-6">
          <Button
            onClick={handleSaveChanges}
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Bảo mật tài khoản</h2>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="flex gap-4 items-center mt-1">
                <Input
                  value={profile.account.email}
                  className="flex-1"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Số điện thoại</label>
              <div className="flex gap-4 items-center mt-1">
                <Input
                  value={profile.phone}
                  className="flex-1"
                  readOnly
                />
                <Button variant="outline" onClick={handleOpenPhoneDialog}>Thay đổi SĐT</Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Mật khẩu</label>
              <div className="flex gap-4 items-center mt-1">
                <Input
                  type="password"
                  value="••••••••••"
                  className="flex-1"
                  readOnly
                />
              </div>
            </div>


          </div>
        </CardContent>
      </Card>
      {/* Add the dialog for phone number change */}
      <Dialog open={isPhoneDialogOpen} onOpenChange={setIsPhoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thay đổi số điện thoại</DialogTitle>
            <DialogDescription>
              Nhập số điện thoại mới của bạn dưới đây.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="new-phone" className="text-sm font-medium">Số điện thoại mới</label>
            <Input
              id="new-phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Nhập số điện thoại mới"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPhoneDialogOpen(false)}
              disabled={isChangingPhone}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdatePhone}
              disabled={isChangingPhone}
            >
              {isChangingPhone ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image upload dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Ảnh Đại Diện</DialogTitle>
            <DialogDescription>
              Chọn ảnh từ máy tính của bạn để làm ảnh đại diện.
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
              onClick={() => {
                if (selectedImage) {
                  uploadImageMutation.mutate(selectedImage);
                } else {
                  toast.error("Vui lòng chọn ảnh để tải lên");
                }
              }}
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

export default Profile;