import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "src/uploads/";

    if (file.fieldname === "image") {
      uploadPath = "src/uploads/thumbnails/";
    } else if (file.fieldname === "pdf") {
      uploadPath = "src/uploads/resources/";
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + "-" + Date.now() + ext);
  },
});
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error("Only images and PDFs allowed"));
  },
});

export default upload;
