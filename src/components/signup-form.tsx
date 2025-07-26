"use client"

import { useState } from "react"
import type React from "react"
import { useSignUp } from "@clerk/clerk-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { AddressService } from "@/services/AddressService";
import { DateOfBirth } from "./DateOfBirth"
import { ProfileService } from "@/services/ProfileService"
import { useAuthContext } from "@/providers/AuthProvider"
import { toast } from "sonner"

interface SignupFormProps extends React.ComponentPropsWithoutRef<"form"> {
  onSwitchToLogin?: () => void
}

export function SignupForm({ className, onSwitchToLogin, ...props }: SignupFormProps) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const auth = useAuthContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  const [citizenId, setCitizenId] = useState("");
  const [gender, setGender] = useState("male");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedWardId, setSelectedWardId] = useState<string>("");

  // Fetch provinces
  const { data: provinces, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: AddressService.getProvinces,
  });

  // Fetch districts based on selected province
  const { data: districts, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ["districts", selectedProvinceId],
    queryFn: () => AddressService.getDistricts(selectedProvinceId),
    enabled: !!selectedProvinceId,
  });

  // Fetch wards based on selected district
  const { data: wards, isLoading: isLoadingWards } = useQuery({
    queryKey: ["wards", selectedDistrictId],
    queryFn: () => AddressService.getWards(selectedDistrictId),
    enabled: !!selectedDistrictId,
  });

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

  if (!isLoaded) {
    return null;
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  // Validate form fields before proceeding
  let isValid = true;

  // Password must be 8 characters or above
  if (password.length < 8) {
    toast.error("Mật khẩu phải có ít nhất 8 ký tự");
    isValid = false;
  }

  // Citizenship ID must be 12 characters
  if (citizenId.length !== 12) {
    toast.error("CCCD/CMND phải có đúng 12 chữ số");
    isValid = false;
  }

  // Date must be selected
  if (!dateOfBirth) {
    toast.error("Vui lòng chọn ngày sinh");
    isValid = false;
  }

  // Confirm password must match
  if (password !== confirmPassword) {
    toast.error("Mật khẩu xác nhận không khớp");
    isValid = false;
  }

  // Address must be fully selected
  if (!selectedProvinceId || !selectedDistrictId || !selectedWardId) {
    toast.error("Vui lòng chọn địa chỉ đầy đủ");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

    // If validation passes, continue with registration
    setIsLoading(true);

    // Format date of birth as ISO string for API or use empty string if undefined
    const formattedDateOfBirth = dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : "";

    // Find location details from provinces, districts, and wards
    const province = provinces?.find(p => p.id === selectedProvinceId);
    const district = districts?.find(d => d.id === selectedDistrictId);
    const ward = wards?.find(w => w.id === selectedWardId);

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        unsafeMetadata: {
          gender,
          dateOfBirth: formattedDateOfBirth,
          phone,
          citizenId,
          provinceId: selectedProvinceId,
          districtId: selectedDistrictId,
          wardId: selectedWardId,
          provinceName: province?.name || null,
          districtName: district?.name || null,
          wardName: ward?.name || null,
          longitude: ward?.longitude || null,
          latitude: ward?.latitude || null
        }
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      toast.success("Vui lòng kiểm tra email để xác thực tài khoản");
      setVerifying(true);
    } catch (err: any) {
      console.error("Error:", err);

      // Check for specific email already in use error
      if (err.errors && err.errors.some((e: any) =>
        e.code === "form_identifier_exists" ||
        e.message?.toLowerCase().includes("email") && e.message?.toLowerCase().includes("already"))) {
        toast.error("Email này đã được sử dụng. Vui lòng sử dụng một địa chỉ email khác.");
      } else {
        toast.error(err.errors?.[0]?.message || "Đã xảy ra lỗi trong quá trình đăng ký.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        toast.success("Xác minh tài khoản thành công!");

        // Wait a moment to ensure auth context is updated with the new session
        setTimeout(async () => {
          try {
            // Get authentication token
            const token = await auth.getToken();

            if (!token) {
              console.error("No authentication token available");
              throw new Error("Authentication failed");
            }

            // Get metadata from signUp
            const userMetadata = completeSignUp.unsafeMetadata as {
              gender: string;
              citizenId: string;
              dateOfBirth: string;
              phone: string;
              provinceId: string;
              districtId: string;
              wardId: string;
            };

            // Find location details from provinces, districts, and wards
            const province = provinces?.find(p => p.id === userMetadata.provinceId);
            const district = districts?.find(d => d.id === userMetadata.districtId);
            const ward = wards?.find(w => w.id === userMetadata.wardId);

            if (province && district && ward) {
              // Update profile using ProfileService
              await ProfileService.updateProfile({
                firstName,
                lastName,
                phone: userMetadata.phone,
                longitude: ward.longitude || "0",
                latitude: ward.latitude || "0",
                wardCode: ward.id,
                districtCode: district.id,
                provinceCode: province.id,
                wardName: ward.name,
                districtName: district.name,
                provinceName: province.name,
                gender: userMetadata.gender,
                dateOfBirth: userMetadata.dateOfBirth,
                citizenId: userMetadata.citizenId
              });

              toast.success("Hồ sơ đã được tạo thành công");
              console.log("Profile updated successfully");
            } else {
              console.error("Missing location data");
              toast.error("Thiếu thông tin địa chỉ");
            }
          } catch (profileError) {
            console.error("Error updating user profile:", profileError);
            toast.error("Không thể cập nhật hồ sơ");
            // Continue with navigation even if profile update fails
          } finally {
            // Navigate to home page when done, even if there were errors
            navigate("/");
          }
        }, 2000); // Give time for auth context to update
      } else {
        console.error("Verification failed", completeSignUp);
        toast.error("Xác minh thất bại. Vui lòng thử lại.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Đã xảy ra lỗi trong quá trình xác minh.");
      setIsLoading(false);
    }
  };

  if (verifying) {
    return (
      <form onSubmit={handleVerify} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Xác minh email của bạn</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Chúng tôi đã gửi mã xác nhận đến email của bạn
          </p>
        </div>
        {error && (
          <div className="text-sm text-red-500 text-center">
            {error}
          </div>
        )}
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="code">Mã xác nhận</Label>
            <Input
              id="code"
              type="text"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Nhập mã từ email của bạn"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang xác minh..." : "Xác minh email"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
      </div>
      {error && (
        <div className="text-sm text-red-500 text-center">
          {error}
        </div>
      )}
      <div className="grid gap-6">
        {/* First Name and Last Name in same row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">Họ</Label>
            <Input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Tên</Label>
            <Input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Gender and Date of Birth in same row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DateOfBirth
            value={dateOfBirth}
            onChange={(date) => setDateOfBirth(date)}
          />
        </div>

        {/* Address fields */}
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="province">Tỉnh/Thành phố</Label>
            <Select value={selectedProvinceId} onValueChange={handleProvinceChange}>
              <SelectTrigger id="province" className="w-full">
                <SelectValue placeholder="Chọn thành phố" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingProvinces ? (
                  <SelectItem value="loading">Đang tải...</SelectItem>
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
          <div className="grid gap-2">
            <Label htmlFor="district">Quận/Huyện</Label>
            <Select
              value={selectedDistrictId}
              onValueChange={handleDistrictChange}
              disabled={!selectedProvinceId}
            >
              <SelectTrigger id="district" className="w-full">
                <SelectValue placeholder="Chọn quận/huyện" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingDistricts ? (
                  <SelectItem value="loading">Đang tải...</SelectItem>
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
          <div className="grid gap-2">
            <Label htmlFor="ward">Phường/Xã</Label>
            <Select
              value={selectedWardId}
              onValueChange={setSelectedWardId}
              disabled={!selectedDistrictId}
            >
              <SelectTrigger id="ward" className="w-full">
                <SelectValue placeholder="Chọn phường/xã" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingWards ? (
                  <SelectItem value="loading">Đang tải...</SelectItem>
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

        <div className="grid grid-cols-2 gap-4">

          <div className="grid gap-2">
            <Label htmlFor="citizenId">CCCD/CMND</Label>
            <Input
              id="citizenId"
              type="text"
              required
              value={citizenId}
              onChange={(e) => setCitizenId(e.target.value)}
              minLength={12}
              maxLength={12}
              pattern="[0-9]{12}"
              placeholder="Nhập CCCD/CMND của bạn"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại của bạn"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="abc@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">Mật khẩu phải có ít nhất 8 ký tự</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Clerk CAPTCHA Widget */}
        <div id="clerk-captcha" className="my-4"></div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Bạn đã có tài khoản?{" "}
        <button type="button" onClick={onSwitchToLogin} className="underline underline-offset-4 hover:text-primary">
          Đăng nhập
        </button>
      </div>
    </form>
  )
}