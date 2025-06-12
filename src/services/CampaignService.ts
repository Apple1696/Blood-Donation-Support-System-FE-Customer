import api from '../config/api';
import { useQuery } from '@tanstack/react-query';

export interface Campaign {
    id: string;
    name: string;
    description: string;
    status: string;
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

export const getCampaigns = async (page: number = 1, limit: number = 10): Promise<CampaignResponse> => {
    const response = await api.get<CampaignResponse>(`/campaigns?page=${page}&limit=${limit}`);
    return response.data;
};

export const useGetCampaigns = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['campaigns', page, limit],
        queryFn: () => getCampaigns(page, limit),
    });
};