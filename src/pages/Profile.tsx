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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressService } from "@/services/AddressService";
import { ProfileService } from "@/services/ProfileService";
import type { CustomerProfile } from "@/services/ProfileService";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Profile = () => {
  const { isAuthenticated, getToken } = useAuthContext();
  const { user } = useUser();
  const queryClient = useQueryClient();

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

  // Function to handle opening the phone change dialog
  const handleOpenPhoneDialog = () => {
    setNewPhone(profile?.phone || "");
    setIsPhoneDialogOpen(true);
  };

  // Function to handle phone number update
  const handleUpdatePhone = async () => {
    if (!newPhone.trim()) {
      toast.error("Phone number cannot be empty");
      return;
    }

    setIsChangingPhone(true);

    try {
      // Use the existing update profile mutation but only update the phone
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
        bloodType: {
          group: profile?.bloodType?.group || "A",
          rh: profile?.bloodType?.rh || "+"
        },
        gender: profile?.gender || "",
        dateOfBirth: profile?.dateOfBirth || "",
        citizenId: profile?.citizenId || "",
      });

      // Close the dialog on success
      setIsPhoneDialogOpen(false);
      toast.success("Phone number updated successfully");
    } catch (error) {
      toast.error("Failed to update phone number");
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

  // Fetch user profile data
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery<CustomerProfile>({
    queryKey: ["profile"],
    queryFn: ProfileService.getProfile,
    enabled: isAuthenticated && isTokenAvailable,
    retry: false
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: ProfileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update profile: " + (error as Error).message);
    }
  });

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

  // Set initial values when profile is loaded
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");

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
        bloodType: {
          group: profile?.bloodType?.group || "A",
          rh: profile?.bloodType?.rh || "+"
        },
        gender: profile?.gender ||"",
        dateOfBirth: profile?.dateOfBirth || "",
        citizenId: profile?.citizenId || "",
      });
    }
  };

  const handleSaveChanges = () => {
    if (!selectedWardId || !selectedDistrictId || !selectedProvinceId) {
      toast.error("Please select all address fields");
      return;
    }

    const selectedProvince = provinces?.find(p => p.id === selectedProvinceId);
    const selectedDistrict = districts?.find(d => d.id === selectedDistrictId);
    const selectedWard = wards?.find(w => w.id === selectedWardId);

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error("Invalid address selection");
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
      bloodType: {
        group: profile?.bloodType?.group || "A",
        rh: profile?.bloodType?.rh || "+"
      },
      gender: profile?.gender || "",
      dateOfBirth: profile?.dateOfBirth || "",
      citizenId: profile?.citizenId || "",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Please log in to view your profile</h1>
      </div>
    );
  }

  if (!isTokenAvailable) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Authenticating...</h1>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Loading profile...</h1>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6 text-destructive">Error loading profile</h1>
        <p className="text-muted-foreground">Please try refreshing the page</p>
      </div>
    );
  }

  if (!profile || !user) return null;

  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`
    : profile.account.email[0].toUpperCase();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            {/* <div className="flex gap-2">
              <Button variant="outline">Change Image</Button>
              <Button variant="outline">Remove Image</Button>
            </div> */}
            <p className="text-sm text-muted-foreground mt-2">
              We support PNGs, JPEGs and GIFs under 2MB
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="text-sm font-medium">Province</label>
              <Select value={selectedProvinceId} onValueChange={handleProvinceChange}>
                <SelectTrigger className="mt-1 w-full">
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
            <div>
              <label className="text-sm font-medium">District</label>
              <Select
                value={selectedDistrictId}
                onValueChange={handleDistrictChange}
                disabled={!selectedProvinceId}
              >
                <SelectTrigger className="mt-1 w-full">
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
            <div>
              <label className="text-sm font-medium">Ward</label>
              <Select
                value={selectedWardId}
                onValueChange={handleWardChange}
                disabled={!selectedDistrictId}
              >
                <SelectTrigger className="mt-1 w-full">
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
          <div className="mt-6">
            <label className="text-sm font-medium">Blood Type</label>
            <div className="mt-1 p-2 border rounded-md bg-gray-50">
              {profile?.bloodType ? `${profile.bloodType.group}${profile.bloodType.rh}` : 'Not specified'}
            </div>
          </div>

        </CardContent>
        <div className="flex justify-end px-6 pb-6">
          <Button
            onClick={handleSaveChanges}
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Account Security</h2>

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
              <label className="text-sm font-medium">Phone Number</label>
              <div className="flex gap-4 items-center mt-1">
                <Input
                  value={profile.phone}
                  className="flex-1"
                  readOnly
                />
                <Button variant="outline" onClick={handleOpenPhoneDialog}>Change Phone</Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="flex gap-4 items-center mt-1">
                <Input
                  type="password"
                  value="••••••••••"
                  className="flex-1"
                  readOnly
                />
                <Button variant="outline">Change password</Button>
              </div>
            </div>


          </div>
        </CardContent>
      </Card>
      {/* Add the dialog for phone number change */}
      <Dialog open={isPhoneDialogOpen} onOpenChange={setIsPhoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Phone Number</DialogTitle>
            <DialogDescription>
              Enter your new phone number below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="new-phone" className="text-sm font-medium">New Phone Number</label>
            <Input
              id="new-phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Enter new phone number"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPhoneDialogOpen(false)}
              disabled={isChangingPhone}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePhone}
              disabled={isChangingPhone}
            >
              {isChangingPhone ? "Updating..." : "Update Phone"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;