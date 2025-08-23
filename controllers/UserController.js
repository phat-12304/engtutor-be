const User = require("../models/User");
const FormatResponse = require("../services/response");
const multer = require("multer");
const path = require("path");
const Services = require("../services/services");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const UploadFile = require("../services/upload");

class UserController {
  async getAll(req, res) {
    try {
      const data = await User.find();
      FormatResponse.success(res, data);
    } catch (error) {
      return FormatResponse.failure(res, error, "Lỗi máy chủ!");
    }
  }
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) return FormatResponse.error(res, "Tài khoản đã tồn tại!");

    try {
      const user = await User.create({ email, password });
      return FormatResponse.success(res, user, "Đăng ký thành công!");
    } catch (error) {
      return FormatResponse.failure(res, error, "Lỗi máy chủ!");
    }
  }
  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return FormatResponse.error(res, "Tài khoản không tồn tại!");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return FormatResponse.error(res, "Sai mật khẩu!");

    try {
      const token = Services.generateJWTToken(user.id);
      return FormatResponse.success(res, user, "Đăng nhập thành công!", token);
    } catch (error) {
      return FormatResponse.failure(res, error, "Lỗi máy chủ!");
    }
  }

  async me(req, res) {
    try {
      const user = await User.findOne({ _id: req.id_user });
      return FormatResponse.success(res, user);
    } catch (error) {
      return FormatResponse.failure(res, error, "Lỗi máy chủ!");
    }
  }

  async update(req, res) {
    const userId = req.id_user;
    const { name, password, confirm } = req.body;

    if (password || confirm) {
      if (password != confirm) {
        return FormatResponse.error(res, "Mật khẩu không trùng khớp!");
      }
    }

    const user = await User.findOne({ _id: userId });
    if (!user) FormatResponse.error(res, "Không tìm thấy tài khoản!");

    try {
      let oldFile;

      if (password) user.password = password;

      if (req.file) {
        oldFile = user.image;
        user.image = req.file.filename;
      }

      if (name) user.name = name;

      await user.save();

      if (req.file) {
        const pathFile = path.join(
          __dirname,
          "..",
          "assets",
          "images",
          "users",
          oldFile
        );
        UploadFile.deleteFile(pathFile);
      }
      return FormatResponse.success(res, user);
    } catch (error) {
      return FormatResponse.failure(res, error, "Lỗi máy chủ!");
    }
  }
}
module.exports = new UserController();
