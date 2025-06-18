// First, let's update your CampaignService to include a single campaign fetch
import api from '../config/api';
import { useQuery } from '@tanstack/react-query';

export const CampaignStatus = {
    ACTIVE: 'active',
    NOT_STARTED: 'not_started',
    ENDED: 'ended'
} as const;

export type CampaignStatus = typeof CampaignStatus[keyof typeof CampaignStatus];

export interface Campaign {
    id: string;
    name: string;
    description: string;
    status: CampaignStatus;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    banner: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface CampaignResponse {
    success: boolean;
    message: string;
    data: {
        data: Campaign[];
        meta: PaginationMeta;
    };
}

export interface SingleCampaignResponse {
    success: boolean;
    message: string;
    data: Campaign;
}

export const getCampaigns = async (page: number = 1, limit: number = 10): Promise<CampaignResponse> => {
    const response = await api.get<CampaignResponse>(`/campaigns?page=${page}&limit=${limit}`);
    return response.data;
};

export const getCampaignById = async (id: string): Promise<SingleCampaignResponse> => {
    const response = await api.get<SingleCampaignResponse>(`/campaigns/${id}`);
    return response.data;
};

export const useGetCampaigns = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['campaigns', page, limit],
        queryFn: () => getCampaigns(page, limit),
    });
};

export const useGetCampaignById = (id: string) => {
    return useQuery({
        queryKey: ['campaign', id],
        queryFn: () => getCampaignById(id),
        enabled: !!id,
    });
};