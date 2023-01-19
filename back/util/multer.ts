import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

aws.config.update({
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  region: 'eu-central-1' // region of your bucket
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    // @ts-ignore
    s3,
    bucket: 'second-hand-images',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    // @ts-ignore
    key: (req, file, cb): void => {
      cb(null, Date.now().toString());
    }
  }),
  limits: { fileSize: 1024 * 1024 * 50 }
});

export default upload;
