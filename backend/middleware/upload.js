const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
const mongoose = require('mongoose');


// Storage

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg'){
          const filename = buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "uploads"
          };
          resolve(fileInfo);

        }
        else{
          reject('Please choose correct type of file.')
        }
        
      });
    });
  }
});

const upload = multer({
    storage
  });

module.exports = upload;