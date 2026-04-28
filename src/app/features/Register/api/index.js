import { axiosService } from "../../../../utils";

export const registerRequest = async (userData) => {
    // userData berisi: name, email, password, password_confirmation
    const response = await axiosService.post('/register', userData);
    return response.data;
};