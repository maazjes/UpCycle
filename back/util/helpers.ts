import probe, { ProbeResult } from 'probe-image-size';
import { Image } from '../models/index.js';
import firebase from './firebase.js';
import { FIREBASE_BUCKET_URL } from './config.js';

export const saveImages = async (
  postId: number,
  files: Express.Multer.File[]
): Promise<Image[]> => {
  const dimensionPromises = files.filter(
    (file): file is typeof file & { location: string } => file.location !== undefined
  ).map((file): Promise<ProbeResult> => probe(file.location));
  const dimensions = await Promise.all(dimensionPromises);
  if (!dimensions) {
    throw new Error('getting image dimensions failed');
  }
  const imagePromises = dimensions.map((image): Promise<Image> => Image.create({
    uri: image.url,
    width: image.width,
    height: image.height,
    postId
  }));
  const images = await Promise.all(imagePromises);
  if (!images) {
    throw new Error('saving images failed');
  }
  return images;
};

export const uploadImage = (file: Express.Multer.File):
Promise<string> => new Promise((resolve, reject): void => {
  const bucket = firebase.storage().bucket(FIREBASE_BUCKET_URL);
  if (!file) {
    reject(new Error('no files'));
  }
  const newFileName = `${file.originalname}_${Date.now()}`;
  const fileUpload = bucket.file(newFileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });
  blobStream.on('error', (): void => {
    reject(new Error('Something is wrong! Unable to upload at the moment.'));
  });
  blobStream.on('finish', (): void => {
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media`;
    resolve(url);
  });
  blobStream.end(file.buffer);
});

export const uploadImages = (files: Express.Multer.File[]):
Promise<string>[] => files.map((file): Promise<string> => uploadImage(file));
