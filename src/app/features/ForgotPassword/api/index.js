import { axiosService } from "../../../../utils";

export const forgotPasswordRequest = async (email) => {
    const response = await axiosService.post('/forgot-password', { email });
    return response.data;
};