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

// Create a new axios instance without the baseURL for proxied requests
const proxyApi = api.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

export const AddressService = {
  getProvinces: async (): Promise<Province[]> => {
    const response = await proxyApi.get<ApiResponse<Province>>('/location/provinces');
    return response.data.data.result;
  },

  getDistricts: async (provinceId: string): Promise<District[]> => {
    const response = await proxyApi.get<ApiResponse<District>>(`/location/districts/${provinceId}`);
    return response.data.data.result;
  },

  getWards: async (districtId: string): Promise<Ward[]> => {
    const response = await proxyApi.get<ApiResponse<Ward>>(`/location/wards/${districtId}`);
    return response.data.data.result;
  }
};
