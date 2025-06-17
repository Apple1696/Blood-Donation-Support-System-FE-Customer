import api from "@/config/api";

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
  bloodGroup: string;
  bloodRh: string;
  status: string;
}

interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  longitude: string;
  latitude: string;
  ward_code: string;
  district_code: string;
  province_code: string;
  ward_name: string;
  district_name: string;
  province_name: string;
  bloodGroup: string;
  bloodRh: string;
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
  }
};
