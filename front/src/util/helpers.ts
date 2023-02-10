import { TypedImage, UpdatePostProps } from '../types';

type IndexSignature = string | number | symbol;

export const addParams = (query: string, params: {
  [key:IndexSignature]:string | number; }): string => {
  Object.keys(params).forEach((key, i): void => {
    if (i === 0) {
      query += `?${key}=${params[key]}`;
    } else {
      query += `&${key}=${params[key]}`;
    }
  });
  return query;
};

export const formatImages = (images: TypedImage[]): Blob[] => {
  const formattedImages = [] as Blob[];
  images.forEach((image): void => {
    const split = image.uri.split('.');
    const extension = split[split.length - 1];
    const formattedImage = {
      uri: image.uri,
      name: 'image',
      type: `image/${extension}`
    } as unknown as Blob;
    formattedImages.push(formattedImage);
  });
  return formattedImages;
};

export const isString = (object: unknown): object is string => (typeof object === 'string');

interface CreateUserFormDataProps {
  displayName?: string;
  email?: string;
  image?: TypedImage;
  bio?: string;
}

type CreateFormDataProps = UpdatePostProps & CreateUserFormDataProps;

export const createFormData = (params: CreateFormDataProps): FormData => {
  const propKeys = Object.keys(params) as Array<keyof CreateFormDataProps>;
  const formdata = new FormData();
  propKeys.forEach((key): void => {
    if (key === 'images' && params.images) {
      const formattedImages = formatImages(params.images);
      formattedImages.forEach((image): void => {
        formdata.append('images', image);
      });
    }
    if (key === 'image' && params.image) {
      const formattedImages = formatImages([params.image]);
      formdata.append('image', formattedImages[0]);
    }
    const value = params[key];
    if (value && isString(value)) {
      formdata.append(key, value);
    }
  });
  return formdata;
};
