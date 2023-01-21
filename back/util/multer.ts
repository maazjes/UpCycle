import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY } from './config';
import { Request } from '../types';

const s3 = new S3Client({
  credentials: {
    secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
    accessKeyId: AWS_S3_ACCESS_KEY_ID
  },
  region: 'eu-central-1' // region of your bucket
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'second-hand-images',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (_req: Request<{}, {}, {}>, _file, cb): void => {
      cb(null, Date.now().toString());
    }
  }),
  limits: { fileSize: 1024 * 1024 * 50 }
});

export default upload;
