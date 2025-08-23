const logger = require("./log");

class FormatResponse {
  /**
   *
   * @param {*} res
   * @param {*} data
   * @param {*} message
   * @param {*} code
   * @returns
   */
  static success(res, data, message = "Thành công!", token = null, code = 200) {
    if (token) {
      res.cookie("jwt_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7 * 1000, // Cookie hết hạn trong 1 tuần / m - h - d - w - milisecond
        sameSite: "strict",
      });
    }

    return res.status(code).json({
      message: message,
      error: false,
      data: data,
    });
  }
  static pagination(res, data, paginate, message = "Thành công!", code = 200) {
    return res.status(code).json({
      message,
      error: false,
      data,
      paginate,
    });
  }
  static failure(res, errors, message = "Thất bại!", code = 500) {
    logger.error(errors);
    return res.status(code).json({
      message: message,
      error: true,
      data: errors,
    });
  }
  static error(res, message = "Lỗi máy chủ!", code = 500) {
    return res.status(code).json({
      message: message,
      error: true,
    });
  }
  static delete(res, message = "Xóa thành công!", code = 201) {
    return res.status(code).json({
      message: message,
      error: false,
    });
  }
  static forTest(res) {
    return res.status(200).json({
      message: "hello",
      error: false,
      data: {},
    });
  }
}
module.exports = FormatResponse;
