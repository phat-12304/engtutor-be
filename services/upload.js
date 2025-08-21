const axios = require("axios");
const fs = require("fs");
const path = require("path");
const logger = require("./log");

class UploadFile {
  /**
   * @param {string} imageUrl - ex: https://thuvienanime.net/wp-content/uploads/2024/03/bach-nguyet-khoi-thuvienanime-18.jpg
   * @param {string} downloadPath - desc: directory + folder + filename
   * @returns
   */
  static async uploadFileFromLink(imageUrl, downloadPath) {
    try {
      const response = await axios({
        method: "GET",
        url: imageUrl,
        responseType: "stream", // Yêu cầu axios trả về dữ liệu dưới dạng stream
      });

      // Tạo thư mục nếu nó chưa tồn tại
      const directory = path.dirname(downloadPath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      // Tạo một write stream để ghi file
      const writer = fs.createWriteStream(downloadPath);

      // Pipe (truyền dữ liệu) từ response stream sang file write stream
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on("finish", () => resolve(downloadPath));
        writer.on("error", reject);
      });
    } catch (error) {
      logger.error(error);
      throw new Error(`Không thể tải hình ảnh từ URL: ${error.message}`);
    }
  }

  /**
   * @param {string} string  ex: sjksjsjsjsj
   * @param {string} branch ex: users
   * @returns {string} filename
   */
  static generateFilename(string, branch = "user") {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const dateString = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;

      return `${dateString}_${branch}_${string}.jpg`;
    } catch (error) {
      logger.error(error);
    }
  }

  static deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
      if (err) {
        logger.error("Xóa file thất bại!", filePath);
        return;
      }
      logger.info("Đã xóa file thành công:", filePath);
    });
  }
}

module.exports = UploadFile;
