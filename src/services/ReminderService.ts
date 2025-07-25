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
  avatar: string | null;
}

// Campaign and CampaignDonation interfaces
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
  metadata: Record<string, any>;
}

export interface CampaignDonation {
  id: string;
  createdAt: string;
  updatedAt: string;
  campaign: Campaign;
  donor: string;
  currentStatus: string;
  appointmentDate: string;
}

export interface CampaignDonationWithDonor {
  id: string;
  createdAt: string;
  updatedAt: string;
  campaign: Campaign;
  donor: Donor;
  currentStatus: string;
  appointmentDate: string;
}

// Metadata types for different reminder types
export interface BeforeDonationMetadata {
  location: string;
  campaignName: string;
  appointmentDate: string;
}

export interface AfterDonationMetadata {
  donationDate: string;
  nextEligibleDate: string;
}

export type ReminderMetadata = BeforeDonationMetadata | AfterDonationMetadata;

export type ReminderType = 'before_donation' | 'after_donation';

export interface Reminder {
  id: string;
  createdAt: string;
  updatedAt: string;
  donor: Donor;
  message: string;
  type: ReminderType;
  metadata: ReminderMetadata;
  campaignDonation: CampaignDonation | null;
}

// Simplified reminder interface for active reminders API
export interface ActiveReminder {
  id: string;
  createdAt: string;
  updatedAt: string;
  donor: string;
  message: string;
  type: ReminderType;
  metadata: ReminderMetadata;
  campaignDonation: string;
}

export interface RemindersResponse {
  success: boolean;
  message: string;
  data: {
    items: Reminder[];
    total: number;
  };
}

export interface ActiveRemindersResponse {
  success: boolean;
  message: string;
  data: {
    campaignDonation: CampaignDonationWithDonor;
    reminders: ActiveReminder[];
  };
}

export interface GetRemindersParams {
  page?: number;
  limit?: number;
  filter?: 'all' | 'before_donation' | 'after_donation';
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

// API service function for active reminders
const getMyActiveReminders = async (): Promise<ActiveRemindersResponse> => {
  const response = await api.get('/reminders/my/active');
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

// React Query hook for active reminders
export const useGetMyActiveReminders = () => {
  return useQuery({
    queryKey: ['reminders', 'my', 'active'],
    queryFn: () => getMyActiveReminders(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Export the service functions for direct use if needed
export { getMyReminders, getMyActiveReminders };