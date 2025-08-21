const Research = require("../models/Research");
const FormatResponse = require("../services/response");
const Paginate = require("../services/paginate");
const User = require("../models/User");
const paginate = require("../services/paginate");

class ResearchController {
  async getAll(req, res) {
    const projection = { keywords: 1 };
    const sort = { createdAt: -1 };
    const query = { is_public: true };
    try {
      const data = await Paginate.main(req, Research, {
        query,
        projection,
        sort,
      });
      return FormatResponse.pagination(res, data.data, data.paginate);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
  async store(req, res) {
    const userId = req.id_user;
    let { keywords, contents } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user)
      return FormatResponse.error(res, "Không tìm thấy người dùng này!");

    if (keywords == "")
      return FormatResponse.error(res, "Không được để trống từ khóa!");
    if (contents == "")
      return FormatResponse.error(res, "Không được để trống nội dung!");

    if (req.query.clone) keywords += ` - ${user.username}`;

    try {
      const data = await Research.create({
        keywords,
        contents,
        id_user: userId,
      });
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
    const userId = req.id_user;

    const user = await User.findOne({ _id: userId });
    if (!user)
      return FormatResponse.error(res, "Không tìm thấy người dùng này!");

    let update = {};
    if (!req.params.id)
      return FormatResponse.error(res, "Không có mã nghiên cứu!");

    if (req.body.keywords && req.body.keywords != "") {
      const keywords = req.body.keywords;
      update = { ...update, keywords };
    }

    if (req.body.contents && req.body.contents != "") {
      const contents = req.body.contents;
      update = { ...update, contents };
    }

    if (Object.keys(update).length > 0) {
      try {
        const research = await Research.findOne({ _id: req.params.id });
        if (!research)
          return FormatResponse.error(res, "Không tìm thấy nghiên cứu!");

        if (research.id_user != userId) {
          return FormatResponse.error(
            res,
            "Không quyền thực hiện thao tác này!",
            403
          );
        }

        const data = await Research.findByIdAndUpdate(research.id, update, {
          new: true,
        });
        return FormatResponse.success(res, data);
      } catch (error) {
        return FormatResponse.failure(res, error);
      }
    }
    return FormatResponse.success(res, {});
  }
  async destroy(req, res) {
    const userId = req.id_user;

    const user = await User.findOne({ _id: userId });
    if (!user)
      return FormatResponse.error(res, "Không tìm thấy người dùng này!");

    if (!req.params.id)
      return FormatResponse.error(res, "Không có mã nghiên cứu!");

    const research = await Research.findById(req.params.id);
    if (!research)
      return FormatResponse.error(res, "Không tìm thấy nghiên cứu này!");

    if (userId != research.id_user)
      return FormatResponse.error(
        res,
        "Không có quyền thực hiện thao tác này!",
        403
      );

    try {
      await Research.findByIdAndDelete(research.id);
      return FormatResponse.delete(res);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
  async forDev(req, res) {
    try {
      const researchs = await Research.find();
      researchs.forEach(async (research) => {
        await Research.updateMany({}, { $set: { is_public: true } });
      });
      return FormatResponse.delete(res);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
  async myResearchs(req, res) {
    const query = {
      id_user: req.id_user,
    };
    const projection = {
      keywords: 1,
      is_public: 1,
    };
    const sort = {
      createdAt: -1,
    };
    try {
      const data = await paginate.main(req, Research, {
        query,
        projection,
        sort,
      });
      return FormatResponse.pagination(res, data.data, data.paginate);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
  async changeStatus(req, res) {
    const userId = req.id_user;

    if (!req.params.id)
      return FormatResponse.error(res, "Không có mã nghiên cứu!");

    const researchId = req.params.id;

    try {
      const research = await Research.findOne({ _id: researchId });
      if (!research)
        return FormatResponse.error(res, "Không tìm thấy nghiên cứu!");

      if (research.id_user != userId)
        return FormatResponse.error(
          "res",
          "Không có quyền thực hiện hành động này!",
          403
        );

      const update = await Research.findByIdAndUpdate(researchId, {
        $set: { is_public: !research.is_public },
      });

      return FormatResponse.success(
        res,
        update,
        "Cập nhật nghiên cứu thành công"
      );
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
}
module.exports = new ResearchController();
