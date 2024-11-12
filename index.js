const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
// console.log('Environment Variables:', {
//     PORT: process.env.PORT,
//     MONGO_URI: process.env.MONGO_URI,
//     CLOUD_NAME: process.env.CLOUD_NAME,
//     CLOUD_API_KEY: process.env.CLOUD_API_KEY,
//     CLOUD_API_SECRET: process.env.CLOUD_API_SECRET
// });


const express = require("express");
const database = require("./db/db_connection");
const route = require("./routes/path.js");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const app = express();

database();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp')
}));
// console.log('Temporary file directory:', path.join(__dirname, 'tmp'));


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

app.use(cors());

app.use("/api", route);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
