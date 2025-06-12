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
  status: string;
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
  }
};
