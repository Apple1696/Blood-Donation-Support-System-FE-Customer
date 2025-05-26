import axios from 'axios';

interface Campaign {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  image: string;
}

const API_URL = 'https://6678e6e40bd452505620352b.mockapi.io/Campaigns';

export const getCampaigns = async (): Promise<Campaign[]> => {
  try {
    const response = await axios.get<Campaign[]>(API_URL);
    // Sort campaigns by start_date in descending order (most recent first)
    const sortedCampaigns = response.data.sort((a: Campaign, b: Campaign) => 
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
    // Return only the 5 most recent campaigns
    return sortedCampaigns.slice(0, 5);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
};

export type { Campaign };
