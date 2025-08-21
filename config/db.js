const mongoose = require("mongoose");
const logger = require("../services/log");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1); // Thoát ứng dụng nếu kết nối thất bại
  }
};

module.exports = connectDB;
