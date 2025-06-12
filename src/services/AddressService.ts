import api from "@/config/api";

interface Location {
  id: string;
  name: string;
  name_en: string;
  full_name: string;
  full_name_en: string;
  latitude: string;
  longitude: string;
}

export type Province = Location;
export type District = Location;
export type Ward = Location;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: {
    isError: number;
    message: string;
    result: T[];
  };
}


export const AddressService = {
  getProvinces: async (): Promise<Province[]> => {
    try {
      const response = await api.get<ApiResponse<Province>>('/location/provinces');
      if (response.data.success && !response.data.data.isError) {
        return response.data.data.result;
      }
      throw new Error(response.data.data.message || 'Failed to fetch provinces');
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  },

  getDistricts: async (provinceId: string): Promise<District[]> => {
    try {
      const response = await api.get<ApiResponse<District>>(`/location/districts/${provinceId}`);
      if (response.data.success && !response.data.data.isError) {
        return response.data.data.result;
      }
      throw new Error(response.data.data.message || 'Failed to fetch districts');
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
    }
  },

  getWards: async (districtId: string): Promise<Ward[]> => {
    try {
      const response = await api.get<ApiResponse<Ward>>(`/location/wards/${districtId}`);
      if (response.data.success && !response.data.data.isError) {
        return response.data.data.result;
      }
      throw new Error(response.data.data.message || 'Failed to fetch wards');
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw error;
    }
  }
};
