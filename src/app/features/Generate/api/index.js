import { axiosService } from "@/utils/axiosConst";

export const generateSalesPage = async (data) => {
    const response = await axiosService.post('/sales-pages', data);
    return response.data;
};