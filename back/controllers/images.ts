const router = require('express').Router();
const upload = require('../util/multer');

// @ts-ignore
router.post('/', upload.single('img'), (req, res) => {
  res.send({
    message: 'Uploaded!',
    // @ts-ignore
    url: req.file.location
  });
});

module.exports = router;
export {};
