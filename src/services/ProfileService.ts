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
  bloodGroup: string | null;
  bloodRh: string | null;
  gender: string;
  dateOfBirth: string;
  citizenId: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const ProfileService = {
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

  // React Query Hooks
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
  }
};