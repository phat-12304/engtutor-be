const FormatResponse = require("../services/response");
const Paginate = require("../services/paginate");
const Package = require("../models/Package");

class PackageController {
  async getAll(req, res) {
    const sort = { createdAt: -1 };
    try {
      const data = await Paginate.main(req, Package, { sort });
      return FormatResponse.pagination(res, data.data, data.paginate);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
  async store(req, res) {
    let { name, desc, price, popular, is_try } = req.body;

    if (name == "")
      return FormatResponse.error(res, "Không được để trống từ khóa!");

    if (desc == "")
      return FormatResponse.error(res, "Không được để trống mô tả!");

    if (price == "")
      return FormatResponse.error(res, "Không được để trống giá!");

    if (popular == "")
      return FormatResponse.error(res, "Không được để trống trạng thái!");

    if (is_try == "")
      return FormatResponse.error(res, "Không được để trống trạng thái thử!");

    try {
      const data = await Tutor.create({ name, image, price, popular, is_try });
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
  async update(req, res) {
    let update = {};
    if (!req.params.id) return FormatResponse.error(res, "Không có mã gói!");

    if (req.body.name && req.body.name != "") {
      const name = req.body.name;
      update = { ...update, name };
    }

    if (req.body.desc && req.body.desc != "") {
      const desc = req.body.desc;
      update = { ...update, desc };
    }

    if (req.body.price && req.body.price != "") {
      const price = req.body.price;
      update = { ...update, price };
    }

    if (req.body.popular && req.body.popular != "") {
      const popular = req.body.popular;
      update = { ...update, popular };
    }

    if (req.body.is_try && req.body.is_try != "") {
      const is_try = req.body.is_try;
      update = { ...update, is_try };
    }

    if (Object.keys(update).length > 0) {
      try {
        const data = await Package.findByIdAndUpdate(req.params.id, update, {
          new: true,
        });
        return FormatResponse.success(res, data);
      } catch (error) {
        return FormatResponse.failure(res, error);
      }
    }
    return FormatResponse.success(res, {}, "Không có gì để cập nhật!");
  }
}
module.exports = new PackageController();
