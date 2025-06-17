import api from "@/config/api";

interface DonationRequestPayload {
  campaignId: string;
  appointmentDate: string;
  note: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const DonationService = {
  createDonationRequest: async (payload: DonationRequestPayload): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>('/donations/requests', payload);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to create donation request');
    } catch (error) {
      console.error('Error creating donation request:', error);
      throw error;
    }
  }
};
