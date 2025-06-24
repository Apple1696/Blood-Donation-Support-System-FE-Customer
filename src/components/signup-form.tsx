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
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Format date of birth as ISO string for API or use empty string if undefined
    const formattedDateOfBirth = dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : "";

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
          wardId: selectedWardId
        }
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err: any) {
      console.error("Error:", err);
      setError("An error occurred during sign up.");
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
                bloodType: {
                  group: "O",
                  rh: "+"
                },
                gender: userMetadata.gender,
                dateOfBirth: userMetadata.dateOfBirth, // This is already formatted correctly from unsafeMetadata
                citizenId: userMetadata.citizenId
              });

              console.log("Profile updated successfully");
            } else {
              console.error("Missing location data");
            }
          } catch (profileError) {
            console.error("Error updating user profile:", profileError);
            // Continue with navigation even if profile update fails
          } finally {
            // Navigate to home page when done, even if there were errors
            navigate("/");
          }
        }, 2000); // Give a second for auth context to update
      } else {
        console.error("Verification failed", completeSignUp);
        setError("Verification failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred during verification.");
      setIsLoading(false);
    }
  };

  if (verifying) {
    return (
      <form onSubmit={handleVerify} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-balance text-sm text-muted-foreground">
            We've sent a verification code to your email
          </p>
        </div>
        {error && (
          <div className="text-sm text-red-500 text-center">
            {error}
          </div>
        )}
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter the code from your email"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
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
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
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
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
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
            <Label htmlFor="province">Province</Label>
            <Select value={selectedProvinceId} onValueChange={handleProvinceChange}>
              <SelectTrigger id="province" className="w-full">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingProvinces ? (
                  <SelectItem value="loading">Loading provinces...</SelectItem>
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
            <Label htmlFor="district">District</Label>
            <Select
              value={selectedDistrictId}
              onValueChange={handleDistrictChange}
              disabled={!selectedProvinceId}
            >
              <SelectTrigger id="district" className="w-full">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingDistricts ? (
                  <SelectItem value="loading">Loading districts...</SelectItem>
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
            <Label htmlFor="ward">Ward</Label>
            <Select
              value={selectedWardId}
              onValueChange={setSelectedWardId}
              disabled={!selectedDistrictId}
            >
              <SelectTrigger id="ward" className="w-full">
                <SelectValue placeholder="Select ward" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingWards ? (
                  <SelectItem value="loading">Loading wards...</SelectItem>
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
            <Label htmlFor="citizenId">Citizen ID</Label>
            <Input
              id="citizenId"
              type="text"
              required
              value={citizenId}
              onChange={(e) => setCitizenId(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
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
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToLogin} className="underline underline-offset-4 hover:text-primary">
          Sign in
        </button>
      </div>
    </form>
  )
}