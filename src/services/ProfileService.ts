interface UpdateHospitalProfileRequest {
  name: string;
  phone: string;
  longitude: string;
  latitude: string;
  wardCode: string;
  districtCode: string;
  provinceCode: string;
  wardName: string;
  districtName: string;
  provinceName: string;
}
export interface HospitalProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  account: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    role: string;
  };
  name: string;
  phone: string;
  longitude: string;
  latitude: string;
  wardCode: string;
  districtCode: string;
  provinceCode: string;
  wardName: string;
  districtName: string;
  provinceName: string;
  status: string;
  avatar: string | null;
}
import api from "@/config/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CustomerProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  account: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    role: string;
  };
  firstName: string;
  lastName: string;
  phone: string;
  longitude: string;
  latitude: string;
  wardCode: string | null;
  districtCode: string | null;
  provinceCode: string | null;
  wardName: string | null;
  districtName: string | null;
  provinceName: string | null;
  bloodType: {
    group: string;
    rh: string;
  };
  status: string;
  gender: string | null;
  dateOfBirth: string | null;
  citizenId: string | null;
  lastDonationDate: string | null;
}

interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  longitude: string;
  latitude: string;
  wardCode: string;
  districtCode: string;
  provinceCode: string;
  wardName: string;
  districtName: string;
  provinceName: string;
  // Replace bloodType object with separate fields
  bloodGroup?: string | null;
  bloodRh?: string | null;
  gender: string;
  dateOfBirth: string;
  citizenId: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface FindNearbyResponse {
  customers: CustomerProfile[];
  count: number;
}

interface FindNearbyParams {
  radius: number; // in kilometers, max 100
  bloodRh: "+" | "-";
  bloodGroup: "A" | "B" | "AB" | "O";
}


export const ProfileService = {
  updateHospitalProfile: async (profileData: UpdateHospitalProfileRequest): Promise<HospitalProfile> => {
    try {
      const response = await api.patch<ApiResponse<HospitalProfile>>('/hospitals/me', profileData);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update hospital profile');
    } catch (error) {
      console.error('Error updating hospital profile:', error);
      throw error;
    }
  },
  getHospitalProfile: async (): Promise<HospitalProfile> => {
    try {
      const response = await api.get<ApiResponse<HospitalProfile>>('/hospitals/me');
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch hospital profile');
    } catch (error) {
      console.error('Error fetching hospital profile:', error);
      throw error;
    }
  },

  getProfile: async (): Promise<CustomerProfile> => {
    try {
      const response = await api.get<ApiResponse<CustomerProfile>>('/customers/me');
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch profile');
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (profileData: UpdateProfileRequest): Promise<CustomerProfile> => {
    try {
      const response = await api.patch<ApiResponse<CustomerProfile>>('/customers/me', profileData);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  findNearbyDonors: async (params: FindNearbyParams): Promise<FindNearbyResponse> => {
    try {
      const { radius, bloodRh, bloodGroup } = params;

      if (radius > 100) {
        throw new Error("Radius cannot exceed 100 kilometers");
      }

      const response = await api.get<ApiResponse<FindNearbyResponse>>('/customers/find-nearby', {
        params: {
          radius,
          bloodRh,
          bloodGroup
        }
      });

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to find nearby donors');
    } catch (error) {
      console.error('Error finding nearby donors:', error);
      throw error;
    }
  },

  // React Query Hooks
  useUpdateHospitalProfile: (onSuccessCallback?: () => void, onErrorCallback?: (error: Error) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ProfileService.updateHospitalProfile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["hospitalProfile"] });
        onSuccessCallback?.();
      },
      onError: (error) => {
        onErrorCallback?.(error as Error);
      }
    });
  },
  useHospitalProfile: (isAuthenticated: boolean, isTokenAvailable: boolean) => {
    return useQuery<HospitalProfile>({
      queryKey: ["hospitalProfile"],
      queryFn: ProfileService.getHospitalProfile,
      enabled: isAuthenticated && isTokenAvailable,
      retry: false
    });
  },
  useProfile: (isAuthenticated: boolean, isTokenAvailable: boolean) => {
    return useQuery<CustomerProfile>({
      queryKey: ["profile"],
      queryFn: ProfileService.getProfile,
      enabled: isAuthenticated && isTokenAvailable,
      retry: false
    });
  },

  useUpdateProfile: (onSuccessCallback?: () => void, onErrorCallback?: (error: Error) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ProfileService.updateProfile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        onSuccessCallback?.();
      },
      onError: (error) => {
        onErrorCallback?.(error as Error);
      }
    });
  },

  useFindNearbyDonors: (params: FindNearbyParams | null, enabled = false) => {
    return useQuery<FindNearbyResponse>({
      queryKey: ["nearbyDonors", params],
      queryFn: () => params ? ProfileService.findNearbyDonors(params) : Promise.reject("Missing parameters"),
      enabled: !!params && enabled,
      retry: false
    });
  }
};

