const FormatResponse = require("../services/response");
const Paginate = require("../services/paginate");
const Order = require("../models/Order");

class OrderController {
  async getAll(req, res) {
    const sort = { createdAt: -1 };
    try {
      const data = await Paginate.main(req, Order, { sort });
      return FormatResponse.pagination(res, data.data, data.paginate);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
  async store(req, res) {
    let { price, note, id_package, id_user } = req.body;

    if (!req.body.hasOwnProperty("price"))
      return FormatResponse.error(res, "Không được để trống giá!");

    if (!req.body.hasOwnProperty("id_package"))
      return FormatResponse.error(res, "Không được để trống mã gói!");

    if (!req.body.hasOwnProperty("id_user"))
      return FormatResponse.error(res, "Không được để trống mã người dùng!");

    try {
      const data = await Order.create({ price, note, id_package, id_user });
      return FormatResponse.success(res, data);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
  async getOne(req, res) {
    if (!req.params.id)
      return FormatResponse.error(res, "Không có mã nghiên cứu!");
    try {
      const data = await Research.findOne({ _id: req.params.id });
      if (!data) return FormatResponse.error(res, "Không tìm thấy nghiên cứu!");

      return FormatResponse.success(res, data);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
}
module.exports = new OrderController();
