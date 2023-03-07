import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';

const deleteImage = (imageId: number): Promise<AxiosResponse<undefined>> => api.delete<undefined>(`images/${imageId}`);

export { deleteImage };
