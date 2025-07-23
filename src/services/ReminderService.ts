import { useQuery } from '@tanstack/react-query';
import api from '../config/api';

// Types based on the API response structure
export interface BloodType {
  group: string;
  rh: string;
}

export interface Donor {
  id: string;
  createdAt: string;
  updatedAt: string;
  account: string;
  bloodType: BloodType;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  citizenId: string;
  longitude: string;
  latitude: string;
  wardCode: string;
  districtCode: string;
  provinceCode: string;
  wardName: string;
  districtName: string;
  provinceName: string;
  lastDonationDate: string;
  status: string;
}

export interface ReminderMetadata {
  eligibleDate: string;
  lastDonationDate: string;
}

export interface Reminder {
  id: string;
  createdAt: string;
  updatedAt: string;
  donor: Donor;
  scheduledDate: string;
  sentDate: string | null;
  message: string;
  metadata: ReminderMetadata;
  campaignDonation: any | null;
}

export interface RemindersResponse {
  success: boolean;
  message: string;
  data: {
    items: Reminder[];
    total: number;
  };
}

export interface GetRemindersParams {
  page?: number;
  limit?: number;
  filter?: string;
}

// API service function
const getMyReminders = async (params: GetRemindersParams): Promise<RemindersResponse> => {
  const { page = 1, limit = 10, filter = 'all' } = params;
  
  const response = await api.get('/reminders/my', {
    params: {
      page,
      limit,
      filter
    }
  });
  
  return response.data;
};

// React Query hook
export const useGetMyReminders = (params: GetRemindersParams = {}) => {
  return useQuery({
    queryKey: ['reminders', 'my', params],
    queryFn: () => getMyReminders(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Export the service function for direct use if needed
export { getMyReminders };