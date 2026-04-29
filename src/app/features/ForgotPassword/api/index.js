import { axiosService } from "@/utils/axiosConst";

export const forgotPasswordRequest = async (email) => {
    const response = await axiosService.post('/forgot-password', { email });
    return response.data;
};