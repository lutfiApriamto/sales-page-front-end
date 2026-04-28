import { axiosService } from "../../../../utils";

export const loginRequest = async (credentials) => {
    const response = await axiosService.post('/login', credentials);
    return response.data;
};