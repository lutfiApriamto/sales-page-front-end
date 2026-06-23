import { axiosService } from '@/utils/axiosConst';

// Upload satu gambar ke Supabase Storage via backend.
// Content-Type sengaja di-undefined agar browser menyetel multipart boundary sendiri.
export const uploadImage = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await axiosService.post('/upload', formData, {
    headers: { 'Content-Type': undefined },
  });
  return response.data; // { status, url, type }
};
