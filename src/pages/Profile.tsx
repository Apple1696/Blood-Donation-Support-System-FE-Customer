import { useAuthContext } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
    setSelectedWardId(value);
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
      ward_code: selectedWardId,
      district_code: selectedDistrictId,
      province_code: selectedProvinceId,
      ward_name: selectedWard.name,
      district_name: selectedDistrict.name,
      province_name: selectedProvince.name,
      bloodGroup: profile?.bloodGroup || "A",
      bloodRh: profile?.bloodRh || "+"
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
            <div className="flex gap-2">
              <Button variant="outline">Change Image</Button>
              <Button variant="outline">Remove Image</Button>
            </div>
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
                  readOnly
                />
                <Button variant="outline">Change email</Button>
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

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">2-Step Verifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an additional layer of security to your account during login.
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Support Access</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Support access</h3>
                <p className="text-sm text-muted-foreground">
                  You have granted us to access to your account for support purposes until Aug 31, 2023, 9:40 PM.
                </p>
              </div>
              <Switch />
            </div>

            <div>
              <h3 className="font-medium mb-1">Log out of all devices</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Log out of all other active sessions on other devices besides this one.
              </p>
              <Button variant="outline">Log out</Button>
            </div>

            <div>
              <h3 className="font-medium text-destructive mb-1">Delete my account</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Permanently delete the account and remove access from all workspaces.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;