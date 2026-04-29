import { axiosService } from "@/utils/axiosConst"; 

export const getSalesPage = async (id) => {
    const response = await axiosService.get(`/sales-pages/${id}`);
    return response.data;
};

export const regenerateSalesPage = async (id, data) => {
    const response = await axiosService.post('/sales-pages', data);
    return response.data;
};

export const deleteSalesPage = async (id) => {
    const response = await axiosService.delete(`/sales-pages/${id}`);
    return response.data;
};