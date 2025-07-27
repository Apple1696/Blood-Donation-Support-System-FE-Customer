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
  avatar?: string | null;
  canChangeBloodType: boolean; // <-- Add this line
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

interface UpdateAvatarRequest {
  avatarUrl: string;
}

interface UploadImageResponse {
  imageUrl: string;
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

/**
 * Uploads an image file and returns the image URL.
 * @param imageFile - The image file to upload (File or Blob).
 * @returns The uploaded image URL.
 */
const uploadImage = async (imageFile: File | Blob): Promise<UploadImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("imageFile", imageFile);

    const response = await api.post<ApiResponse<UploadImageResponse>>("/image/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to upload image");
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

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
        // Ensure canChangeBloodType is present and defaults to true if missing
        return {
          ...response.data.data,
          canChangeBloodType: response.data.data.canChangeBloodType ?? true
        };
      }
      throw new Error(response.data.message || 'Failed to fetch profile');
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (profileData: UpdateProfileRequest): Promise<CustomerProfile> => {
    try {
      // Change PATCH to PUT
      const response = await api.put<ApiResponse<CustomerProfile>>('/customers/me', profileData);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

   updateAvatar: async (avatarData: UpdateAvatarRequest): Promise<CustomerProfile> => {
    try {
      const response = await api.put<ApiResponse<CustomerProfile>>('/customers/me/avatar', avatarData);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update avatar');
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  },

  uploadImage,

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

  useUpdateAvatar: (onSuccessCallback?: () => void, onErrorCallback?: (error: Error) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ProfileService.updateAvatar,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        onSuccessCallback?.();
      },
      onError: (error) => {
        onErrorCallback?.(error as Error);
      }
    });
  },

  // Optional: React Query hook for image upload
  useUploadImage: (onSuccessCallback?: (data: UploadImageResponse) => void, onErrorCallback?: (error: Error) => void) => {
    return useMutation({
      mutationFn: (imageFile: File | Blob) => ProfileService.uploadImage(imageFile),
      onSuccess: (data) => {
        onSuccessCallback?.(data);
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

