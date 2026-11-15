const multer = require('multer')
const path =  require("node:path");
const uploadDir = path.resolve("uploads");


const storage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, 'public/uploads')
    },
filename: function (req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  cb(null, `${file.fieldname}-${Date.now()}${extension}`);
}
});

const upload = multer({ storage: storage });


module.exports = upload