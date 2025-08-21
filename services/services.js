const crypto = require("crypto");
const jwt = require("jsonwebtoken");
class Services {
  static securitySecretKey = `ae9f69399bd58ab9acc22224c5e95307aa29d2c5243773a9ccdd6cb56a8b108a`;
  static google_client_id =
    "575187468549-636cb4fpdu7m8dh7vuj3bpvhavc0vp37.apps.googleusercontent.com";
  /**
   * @param {string} path
   * @returns url
   */
  static url_be(path = "") {
    return `http://localhost:3435${path}`;
  }

  /**
   * @param {string} path
   * @returns url
   */
  static url_fe(path = "") {
    return `http://localhost:5173${path}`;
  }

  /**
   * @param {string} data
   * @returns token - string
   */
  static gen_auth_token(data) {
    const hash = crypto.createHash("sha256");
    hash.update(data + Services.securitySecretKey);
    return hash.digest("hex");
  }

  /**
   * @param {int} id
   * @returns token - string
   */
  static generateJWTToken(id) {
    return jwt.sign({ id }, Services.securitySecretKey, {
      expiresIn: "7d", // Token hết hạn sau 7 ngày
    });
  }

  /**
   * @param {timestamp} datetime
   * @returns {string} date format
   */
  static dateFormat(datetime) {
    const date = new Date(datetime);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }
}
module.exports = Services;
