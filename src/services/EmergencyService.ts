import api from "../config/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

// Define types
export interface EmergencyRequestPayload {
  requiredVolume: number;
  bloodGroup: string;
  bloodRh: string;
  bloodTypeComponent: string;
  wardCode: string;
  districtCode: string;
  provinceCode: string;
  wardName: string;
  districtName: string;
  provinceName: string;
  longitude: string;
  latitude: string;
}

export interface EmergencyResponse {
  id: string;
  requestedBy: Record<string, any>;
  bloodUnit: Record<string, any>;
  usedVolume: number;
  requiredVolume: number;
  bloodType: Record<string, any>;
  bloodTypeComponent: string;
  status: string;
  startDate: string;
  endDate: string;
  wardCode: string;
  districtCode: string;
  provinceCode: string;
  wardName: string;
  districtName: string;
  provinceName: string;
  longitude: string;
  latitude: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface EmergencyRequestFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected';
  bloodGroup?: 'A' | 'B' | 'AB' | 'O';
  bloodRh?: '+' | '-';
  bloodTypeComponent?: 'plasma' | 'platelets' | 'red_cells' | 'whole_blood';
}

// API functions
const createEmergencyRequest = async (payload: EmergencyRequestPayload): Promise<EmergencyResponse> => {
  const response = await api.post('/emergency-requests', payload);
  return response.data;
};

const getEmergencyRequests = async (filters?: EmergencyRequestFilters): Promise<PaginatedResponse<EmergencyResponse>> => {
  const response = await api.get('/emergency-requests', { 
    params: filters 
  });
  // Return the data property which contains the PaginatedResponse
  return response.data.data;
};

const getEmergencyRequestById = async (id: string): Promise<EmergencyResponse> => {
  const response = await api.get(`/emergency-requests/${id}`);
  return response.data;
};

const updateEmergencyRequest = async ({ 
  id, 
  payload 
}: { 
  id: string; 
  payload: Partial<EmergencyRequestPayload> 
}): Promise<EmergencyResponse> => {
  const response = await api.patch(`/emergency-requests/${id}`, payload);
  return response.data;
};

const deleteEmergencyRequest = async (id: string): Promise<void> => {
  await api.delete(`/emergency-requests/${id}`);
};

// React Query hooks
export const useCreateEmergencyRequest = () => {
  return useMutation({
    mutationFn: createEmergencyRequest,
  });
};

export const useGetEmergencyRequests = (
  filters?: EmergencyRequestFilters, 
  options?: UseQueryOptions<PaginatedResponse<EmergencyResponse>>
) => {
  return useQuery({
    queryKey: ['emergencyRequests', filters],
    queryFn: () => getEmergencyRequests(filters),
    ...options,
  });
};

export const useGetEmergencyRequestById = (id: string, options?: UseQueryOptions<EmergencyResponse>) => {
  return useQuery({
    queryKey: ['emergencyRequest', id],
    queryFn: () => getEmergencyRequestById(id),
    enabled: !!id,
    ...options,
  });
};

export const useUpdateEmergencyRequest = () => {
  return useMutation({
    mutationFn: updateEmergencyRequest,
  });
};

export const useDeleteEmergencyRequest = () => {
  return useMutation({
    mutationFn: deleteEmergencyRequest,
  });
};

export default {
  createEmergencyRequest,
  getEmergencyRequests,
  getEmergencyRequestById,
  updateEmergencyRequest,
  deleteEmergencyRequest,
  useCreateEmergencyRequest,
  useGetEmergencyRequests,
  useGetEmergencyRequestById,
  useUpdateEmergencyRequest,
  useDeleteEmergencyRequest,
};