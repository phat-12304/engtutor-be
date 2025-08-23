const jwt = require("jsonwebtoken");
const FormatResponse = require("../services/response");
const Services = require("../services/services");

// Middleware xác thực JWT từ cookie
const protect = (req, res, next) => {
  let token;

  if (req.cookies) token = req.cookies.jwt_token;

  if (!token) {
    return FormatResponse.error(res, "Không có token, không thể xác thực!");
  }

  try {
    const decoded = jwt.verify(token, Services.securitySecretKey);
    req.id_user = decoded.id;
    next();
  } catch (error) {
    return FormatResponse.failure(res, error, "Token không hợp lệ");
  }
};
module.exports = protect;
