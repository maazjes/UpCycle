import upload from '../util/multer';

const router = require('express').Router();

// @ts-ignore
router.post('/', upload.single('img'), (req, res): void => {
  res.send({
    message: 'Uploaded!',
    // @ts-ignore
    url: req.file.location
  });
});

export default router;
