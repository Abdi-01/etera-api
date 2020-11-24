const multer = require("multer");
const fs = require("fs");

module.exports = {
  uploader(destination, fileNamePrefix) {
    let defaultPath = "./public";
    console.log();
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        let dir = defaultPath + destination;
        if (file.fieldname === "pl_file") {
          dir = defaultPath + "/pl_file";
        }
        if (fs.existsSync(dir)) {
          console.log(dir, "Exists");
          cb(null, dir);
        } else {
          fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
          console.log(dir, "make");
        }
      },
      filename: (req, file, cb) => {
        console.log("file.mimetype");
        let originalname = file.originalname;
        let ext = originalname.split(".");
        let filename = fileNamePrefix + Date.now() + "." + ext[ext.length - 1];
        if (file.fieldname === "pl_file") {
          filename = "FILE" + Date.now() + "." + ext[ext.length - 1];
        }
        cb(null, filename);
      },
    });
    const imageFilter = (req, file, cb) => {
      const ext = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xlsx)$/;
      if (!file.originalname.match(ext)) {
        return cb(new Error("Only selected file type are allowed"), false);
      }
      cb(null, true);
    };
    return multer({
      storage,
      fileFilter: imageFilter,
    });
  },
};
