import { AxiosResponse } from 'axios';
import { TypedImage } from '../types';
import api from '../util/axiosInstance';

type BackendImage = Omit<TypedImage, 'id'> & { id: number };

const deleteImage = async (id: string): Promise<AxiosResponse<TypedImage>> => {
  const query = `images/${id}`;
  const image = await api.delete<BackendImage>(query) as unknown as AxiosResponse<TypedImage>;
  image.data.id = String(image.data.id);
  return image;
};

export default { deleteImage };
