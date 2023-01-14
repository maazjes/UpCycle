const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  region: 'eu-central-1' // region of your bucket
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'second-hand-images',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    // @ts-ignore
    key: (req, file, cb) => {
      const extension = file.mimetype === 'image/jpeg' ? '.jpg' : '.png';
      cb(null, Date.now().toString() + extension);
    }
  }),
  limits: { fileSize: 1024 * 1024 * 50 }
});

module.exports = upload;
