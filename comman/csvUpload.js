var multer = require('multer')

const csvFilter = (req, file, cb) => {
    if (file.mimetype.includes("csv")) {
      cb(null, true);
    } else {
        cb("Please upload csv file only", false);
    }
  };

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var destination = 'csv';
        if (req.FILE_DESTINATION) {
            destination = req.FILE_DESTINATION;
        }
        cb(null, path.join(APP_PATH, path.join('public', destination)))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + _.ext(file.originalname))
    }
})

CSV_STORAGE = module.exports = multer({ storage: storage, fileFilter: csvFilter })