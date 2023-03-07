import { isString } from 'formik';
import { PaginationBase } from '@shared/types';
import { Dimensions, PixelRatio } from 'react-native';
import { UpdatePostBody } from '../types';

type IndexSignature = string | number | symbol;

export const addQuery = (query: string, params: {
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

export const formatImages = (images: { uri: string }[]): Blob[] => {
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

interface CreateUserFormDataProps {
  displayName?: string;
  email?: string;
  image?: { uri: string };
  bio?: string;
}

type CreateFormDataProps = UpdatePostBody & CreateUserFormDataProps;

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

export const concatPages = (oldPage: PaginationBase, newPage: PaginationBase):
PaginationBase => ({
  totalItems: newPage.totalItems,
  offset: newPage.offset,
  data: oldPage.data.concat(newPage.data)
});

export const dpw = (widthPercent: number): number => {
  const screenWidth = Dimensions.get('window').width;
  return PixelRatio.roundToNearestPixel(screenWidth * widthPercent);
};

export const dph = (heightPercent: number): number => {
  const screenHeight = Dimensions.get('window').height;
  return PixelRatio.roundToNearestPixel(screenHeight * heightPercent);
};
