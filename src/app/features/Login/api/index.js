import { axiosService } from "@/utils/axiosConst"; 

export const loginRequest = async (credentials) => {
    const response = await axiosService.post('/login', credentials);
    return response.data;
};