import api from "@/config/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface DonationRequestPayload {
  campaignId: string;
  appointmentDate: string;
  volumeMl: number;
  note: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Campaign {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  banner: string;
  location: string;
  limitDonation: number;
  bloodCollectionDate: string;
  metadata: null;
}

export interface Donor {
  id: string;
  createdAt: string;
  updatedAt: string;
  account: string;
  bloodType: {
    group: string;
    rh: string;
  };
  firstName: string;
  lastName: string;
  gender: string | null;
  dateOfBirth: string | null;
  phone: string;
  citizenId: string | null;
  longitude: string;
  latitude: string;
  wardCode: string;
  districtCode: string;
  provinceCode: string;
  wardName: string;
  districtName: string;
  provinceName: string;
  status: string;
}

export interface DonationRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  campaign: Campaign;
  donor: Donor;
  currentStatus: string;
  appointmentDate: string;
}

export interface DonationRequestsResponse {
  items: DonationRequest[];
  total: number;
}

export interface DonationResult {
  id: string;
  createdAt: string;
  updatedAt: string;
  campaignDonation: {
    id: string;
    createdAt: string;
    updatedAt: string;
    campaign: string;
    donor: Donor & {
      lastDonationDate?: string;
      avatar?: string | null;
    };
    currentStatus: string;
    appointmentDate: string;
  };
  volumeMl: number;
  bloodGroup: string;
  bloodRh: string;
  notes: string;
  rejectReason: string;
  status: string;
  processedBy: {
    id: string;
    createdAt: string;
    updatedAt: string;
    account: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar: string;
  };
}

const getDonationResultById = async (id: string): Promise<DonationResult> => {
  try {
    const response = await api.get<ApiResponse<DonationResult>>(`/donations/my-requests/${id}/result`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch donation result');
  } catch (error: any) {
    console.error('Error fetching donation result:', error);

    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please ensure you are logged in.');
    }
    if (error.response?.status === 404) {
      throw new Error('Donation result not found');
    }

    throw error;
  }
};

const createDonationRequest = async (payload: DonationRequestPayload): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>('/donations/requests', payload);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to create donation request');
  } catch (error: any) {
    console.error('Error creating donation request:', error);

    // Add better error handling
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please ensure you are logged in.');
    }

    throw error;
  }
};

const getMyDonationRequests = async (): Promise<DonationRequestsResponse> => {
  try {
    const response = await api.get<ApiResponse<DonationRequestsResponse>>('/donations/my-requests');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch donation requests');
  } catch (error: any) {
    console.error('Error fetching donation requests:', error);

    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please ensure you are logged in.');
    }

    throw error;
  }
};

const getDonationRequestById = async (id: string): Promise<DonationRequest> => {
  try {
    const response = await api.get<ApiResponse<DonationRequest>>(`/donations/my-requests/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch donation request');
  } catch (error: any) {
    console.error('Error fetching donation request:', error);

    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please ensure you are logged in.');
    }
    if (error.response?.status === 404) {
      throw new Error('Donation request not found');
    }

    throw error;
  }
};

const cancelDonationRequest = async (id: string): Promise<ApiResponse<DonationRequest>> => {
  try {
    const response = await api.patch<ApiResponse<DonationRequest>>(`/donations/my-requests/${id}/cancel`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to cancel donation request');
  } catch (error: any) {
    console.error('Error cancelling donation request:', error);

    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please ensure you are logged in.');
    }
    if (error.response?.status === 404) {
      throw new Error('Donation request not found');
    }
    if (error.response?.status === 400) {
      throw new Error('Cannot cancel this donation request');
    }

    throw error;
  }
};

export const DonationService = {
  createDonationRequest,
  getMyDonationRequests,
  getDonationRequestById,
  cancelDonationRequest,
  getDonationResultById,

  useDonationResultById: (id: string) => {
    return useQuery({
      queryKey: ['donations', 'my-requests', id, 'result'],
      queryFn: () => getDonationResultById(id),
      enabled: !!id
    });
  },

  
  useCreateDonationRequest: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: createDonationRequest,
      onSuccess: () => {
        // Invalidate any related queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['donations'] });
      }
    });
  },

  useMyDonationRequests: () => {
    return useQuery({
      queryKey: ['donations', 'my-requests'],
      queryFn: getMyDonationRequests
    });
  },

  useDonationRequestById: (id: string) => {
    return useQuery({
      queryKey: ['donations', 'my-requests', id],
      queryFn: () => getDonationRequestById(id),
      enabled: !!id // Only run the query if id is provided
    });
  },

  useCancelDonationRequest: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: cancelDonationRequest,
      onSuccess: (data, id) => {
        // Invalidate related queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['donations', 'my-requests'] });
        queryClient.invalidateQueries({ queryKey: ['donations', 'my-requests', id] });
      }
    });
  }
};