import { createHash, Hash } from 'crypto';
import { createReadStream, PathLike } from 'fs';
import sharp from 'sharp';
import { InferAttributes } from 'sequelize';
import sgMail, { ClientResponse } from '@sendgrid/mail';
import { Image } from '../models/index.js';
import firebase from './firebase.js';
import { FIREBASE_BUCKET_URL, SENDGRID_API_KEY, VERIFIED_EMAIL } from './config.js';

sgMail.setApiKey(SENDGRID_API_KEY);

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

export const uploadImage = (image: sharp.Sharp, mimetype: string, name: string): Promise<string> =>
  new Promise((resolve, reject): void => {
    (async (): Promise<void> => {
      const bucket = firebase.storage().bucket(FIREBASE_BUCKET_URL);
      const fileUpload = bucket.file(name);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: mimetype
        }
      });
      blobStream.on('error', (): void => {
        reject(new Error('Something went wrong! Unable to upload at the moment.'));
      });
      blobStream.on('finish', (): void => {
        // eslint-disable-next-line max-len
        const parts = name.split('_');
        parts.pop();
        const uri = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${parts.join(
          '_'
        )}`;
        resolve(uri);
      });
      const buffer = await image.toBuffer();
      blobStream.end(buffer);
    })();
  });

export const uploadPostImages = async (files: Express.Multer.File[]): Promise<string[]> => {
  const promises: Promise<string>[] = [];
  files.forEach((file): void => {
    const uploadTime = Date.now();
    const resized200 = sharp(file.buffer).resize(200, 200).withMetadata().jpeg();
    const resized400 = sharp(file.buffer).resize(400, 400).withMetadata().jpeg();
    promises.push(
      uploadImage(resized200, file.mimetype, `${file.originalname}_${uploadTime}_200x200`)
    );
    promises.push(
      uploadImage(resized400, file.mimetype, `${file.originalname}_${uploadTime}_400x400`)
    );
  });
  const uris = await Promise.all(promises);
  return [...new Set(uris)];
};

export const uploadMessageImages = async (files: Express.Multer.File[]): Promise<string[]> => {
  const promises: Promise<string>[] = [];
  const images = files.map((file): sharp.Sharp => sharp(file.buffer));
  const metadatas = await Promise.all(
    images.map((image): Promise<sharp.Metadata> => image.metadata())
  );
  files.forEach(async (file, i): Promise<void> => {
    const uploadTime = Date.now();
    promises.push(
      uploadImage(
        (metadatas[i].width || 0) < 400
          ? images[i].jpeg()
          : images[i].resize({ width: 400, height: 400, fit: 'contain' }).withMetadata().jpeg(),
        file.mimetype,
        `${file.originalname}_${uploadTime}_original`
      )
    );
  });
  const uris = await Promise.all(promises);
  return [...new Set(uris)];
};

export const uploadProfileImage = async (file: Express.Multer.File): Promise<string> => {
  const image = sharp(file.buffer);
  const metadata = await image.metadata();
  const uploadTime = Date.now();
  const uri = uploadImage(
    metadata.height || 0 < 100
      ? image.jpeg()
      : image.resize({ width: 100, height: 100 }).withMetadata().jpeg(),
    file.mimetype,
    `${file.originalname}_${uploadTime}_100x100`
  );
  return uri;
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

export const sendEmail = (
  to: string,
  subject: string,
  text: string
): Promise<[ClientResponse, {}]> => {
  const message = {
    from: {
      name: 'UpCycle',
      email: VERIFIED_EMAIL
    },
    to,
    subject,
    text
  };
  return sgMail.send(message);
};
