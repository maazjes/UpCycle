import { createHash, Hash } from 'crypto';
import { createReadStream, PathLike } from 'fs';
import sharp from 'sharp';
import { InferAttributes } from 'sequelize';
import { Image } from '../models/index.js';
import firebase from './firebase.js';
import { FIREBASE_BUCKET_URL } from './config.js';

export const saveImages = async (
  uris: string[],
  postId?: number,
  messageId?: number
): Promise<Image[]> => {
  const imagesToSave = uris.map(
    (uri): Omit<InferAttributes<Image>, 'id'> => ({ uri, postId, messageId })
  );
  return Image.bulkCreate(imagesToSave);
};

export const uploadImage = (
  file: Express.Multer.File,
  date: number,
  { width, height }: { width: number; height: number }
): Promise<string> => {
  const resizedImage = sharp(file.buffer).resize(width, height).jpeg();
  return new Promise((resolve, reject): void => {
    (async (): Promise<void> => {
      const bucket = firebase.storage().bucket(FIREBASE_BUCKET_URL);
      if (!file) {
        reject(new Error('no files'));
      }
      const newFileName = `${file.originalname}_${date}_${width}x${height}`;
      const fileUpload = bucket.file(newFileName);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });
      blobStream.on('error', (): void => {
        reject(new Error('Something went wrong! Unable to upload at the moment.'));
      });
      blobStream.on('finish', (): void => {
        // eslint-disable-next-line max-len
        const parts = newFileName.split('_');
        parts.pop();
        const uri = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${parts.join(
          '_'
        )}`;
        resolve(uri);
      });
      const buffer = await resizedImage.toBuffer();
      blobStream.end(buffer);
    })();
  });
};

export const uploadPostImages = async (files: Express.Multer.File[]): Promise<string[]> => {
  const uploadTime = Date.now();
  const uris = await Promise.all(
    files
      .map((file): Promise<string> => uploadImage(file, uploadTime, { width: 200, height: 200 }))
      .concat(
        files.map(
          (file): Promise<string> => uploadImage(file, uploadTime, { width: 100, height: 100 })
        )
      )
      .concat(
        files.map(
          (file): Promise<string> => uploadImage(file, uploadTime, { width: 400, height: 400 })
        )
      )
  );
  return [...new Set(uris)];
};

export const getPagination = (page: number, size: number): { limit: number; offset: number } => {
  const limit = size || 3;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};

export const getPagingData = (
  totalItems: number,
  page: number,
  limit: number
): {
  totalItems: number;
  totalPages: number;
  currentPage: number;
} => {
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    totalPages,
    currentPage
  };
};

export const isString = (object: unknown): object is string =>
  typeof object === 'string' || object instanceof String;

export const hashFile = async (path: PathLike, algo = 'md5'): Promise<string> => {
  const hashFunc = createHash(algo);
  const contentStream = createReadStream(path);
  const updateDone = new Promise((resolve, reject): void => {
    contentStream.on('data', (data): Hash => hashFunc.update(data));
    contentStream.on('close', resolve);
    contentStream.on('error', reject);
  });

  await updateDone;
  return hashFunc.digest('hex');
};
