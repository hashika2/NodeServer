/* nee to clarrify */

require("dotenv").config();
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");

const mongoURI = "mongodb+srv://hashika:hashika@cluster0-qollh.mongodb.net/test?retryWrites=true&w=majority";
const conn = mongoose.createConnection(mongoURI,{useUnifiedTopology: true,useNewUrlParser: true});

 /* init gfs */
let gfs;
conn.once("open", () => {
    /* init stream */
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

const setStorage = () => {
  /* Storage */
  const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
  });
  return storage;
}

module.exports = { setStorage } ;