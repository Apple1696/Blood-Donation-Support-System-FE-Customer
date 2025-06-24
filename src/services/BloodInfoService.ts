import api from '../config/api';

export interface BloodInfo {
    group: string;
    rh: string;
    description: string;
    characteristics: string;
    canDonateTo: string;
    canReceiveFrom: string;
    frequency: string;
    specialNotes: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface BloodComponentCompatibility {
    componentType: string;
    compatibleDonors: BloodInfo[];
    compatibleRecipients: BloodInfo[];
}

class BloodInfoService {
    /**
     * Get all blood info types
     * @returns Promise containing array of blood info
     */
    async getAllBloodInfo(): Promise<BloodInfo[]> {
        try {
            const response = await api.get<ApiResponse<BloodInfo[]>>('/blood-info');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching blood info:', error);
            throw error;
        }
    }

    /**
     * Get specific blood info by blood group and Rh factor
     * @param group Blood group (A, B, AB, O)
     * @param rh Rh factor (+ or -)
     * @returns Promise containing specific blood info
     */
    async getBloodInfoByType(group: string, rh: string): Promise<BloodInfo> {
        try {
            const response = await api.get<ApiResponse<BloodInfo>>(`/blood-info/${group}/${rh}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching blood info for ${group}${rh}:`, error);
            throw error;
        }
    }

    /**
     * Search for blood info by blood type string (e.g. "A+", "O-")
     * @param bloodTypeString The blood type in string format (e.g. "A+", "O-")
     * @returns Promise containing specific blood info
     */
    async searchBloodInfo(bloodTypeString: string): Promise<BloodInfo> {
        try {
            // Parse the blood type string to extract group and rh
            const group = bloodTypeString.charAt(0).toUpperCase();
            const rh = bloodTypeString.charAt(1);

            // Validate input
            if (!['A', 'B', 'O', 'AB'].includes(group === 'A' && bloodTypeString.startsWith('AB') ? 'AB' : group)) {
                throw new Error(`Invalid blood group: ${group}`);
            }

            if (!['+', '-'].includes(rh)) {
                throw new Error(`Invalid Rh factor: ${rh}`);
            }

            // Get the correct group (handling AB special case)
            const actualGroup = bloodTypeString.startsWith('AB') ? 'AB' : group;
            const actualRh = bloodTypeString.startsWith('AB') ? bloodTypeString.charAt(2) : rh;

            return this.getBloodInfoByType(actualGroup, actualRh);
        } catch (error) {
            console.error(`Error searching blood info for ${bloodTypeString}:`, error);
            throw error;
        }
    }

    /**
     * Get compatibility information for a specific blood type
     * @param group Blood group (A, B, AB, O)
     * @param rh Rh factor (+ or -)
     * @returns Object containing donation and reception compatibility
     */
    async getCompatibilityInfo(group: string, rh: string): Promise<{ canDonate: string[], canReceive: string[] }> {
        try {
            const bloodInfo = await this.getBloodInfoByType(group, rh);

            // Parse the compatibility strings into arrays
            const canDonate = bloodInfo.canDonateTo
                .replace('Có thể hiến cho:', '')
                .split(',')
                .map(type => type.trim());

            const canReceive = bloodInfo.canReceiveFrom
                .replace('Có thể nhận từ:', '')
                .split(',')
                .map(type => type.trim());

            return { canDonate, canReceive };
        } catch (error) {
            console.error(`Error getting compatibility info for ${group}${rh}:`, error);
            throw error;
        }
    }
    /**
   * Get detailed component compatibility information for a specific blood type
   * @param group Blood group (A, B, AB, O)
   * @param rh Rh factor (+ or -)
   * @returns Promise containing compatibility information for different blood components
   */
    async getComponentCompatibility(group: string, rh: string): Promise<BloodComponentCompatibility[]> {
        try {
            const response = await api.get<ApiResponse<BloodComponentCompatibility[]>>(
                `/blood-info/${group}/${rh}/compatibility`
            );
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching component compatibility for ${group}${rh}:`, error);
            throw error;
        }
    }
}

export default new BloodInfoService();