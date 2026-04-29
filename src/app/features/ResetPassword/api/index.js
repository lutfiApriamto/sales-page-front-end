import { axiosService } from "@/utils/axiosConst";

export const resetPasswordRequest = async (data) => {
    const response = await axiosService.post('/reset-password', data);
    return response.data;
};