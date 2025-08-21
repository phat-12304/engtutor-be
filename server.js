const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Tải biến môi trường từ .env
dotenv.config();

// Kết nối đến cơ sở dữ liệu
connectDB();

const app = express();

app.use(cors());

// Middleware để phân tích JSON body
app.use(express.json());

app.use(cookieParser());

app.use("/assets", express.static("assets"));

const router = require("./routes/main");

app.use("/api", router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
