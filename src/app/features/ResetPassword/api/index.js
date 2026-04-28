import { axiosService } from "../../../../utils";

export const resetPasswordRequest = async (data) => {
    const response = await axiosService.post('/reset-password', data);
    return response.data;
};