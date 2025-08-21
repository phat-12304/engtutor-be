const Tutor = require("../models/Tutor");
const FormatResponse = require("../services/response");
const Paginate = require("../services/paginate");
const User = require("../models/User");
const paginate = require("../services/paginate");
const UploadFile = require("../services/upload");
const Services = require("../services/services");
const path = require("path");

class TutorController {
  async getAll(req, res) {
    const sort = { createdAt: -1 };
    try {
      const data = await Paginate.main(req, Tutor, { sort });
      return FormatResponse.pagination(res, data.data, data.paginate);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
  async store(req, res) {
    let { name, image, nation } = req.body;

    if (name == "")
      return FormatResponse.error(res, "Không được để trống từ khóa!");

    try {
      let filename;

      if (image) {
        filename = UploadFile.generateFilename(
          Services.gen_auth_token(name),
          "tutor"
        );
      }

      const data = await Tutor.create({
        name,
        image: filename ?? "clone.jpg",
        nation,
      });
      if (filename) {
        await UploadFile.uploadFileFromLink(
          String(image).trim(),
          path.join(__dirname, "..", "assets", "images", "tutors", filename)
        );
      }
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
    let hasImage = false;
    if (!req.params.id) return FormatResponse.error(res, "Không có mã gia sư!");

    if (req.body.name && req.body.name != "") {
      const name = req.body.name;
      update = { ...update, name };
    }

    if (req.body.nation && req.body.nation != "") {
      const nation = req.body.nation;
      update = { ...update, nation };
    }

    if (req.body.image && req.body.image != "") {
      update = { ...update, image: req.body.image };
      hasImage = true;
    }

    if (Object.keys(update).length > 0) {
      try {
        let filename;
        const pathImage = path.join(
          __dirname,
          "..",
          "assets",
          "images",
          "tutors"
        );

        const tutor = await Tutor.findOne({ _id: req.params.id });
        if (!tutor) return FormatResponse.error(res, "Không tìm thấy gia sư!");

        if (hasImage) {
          UploadFile.deleteFile(path.join(pathImage, tutor.image));
          filename = UploadFile.generateFilename(
            Services.gen_auth_token(tutor.name),
            "tutor"
          );
          update = { ...update, image: filename };
        }

        const data = await Tutor.findByIdAndUpdate(tutor.id, update, {
          new: true,
        });
        if (hasImage) {
          await UploadFile.uploadFileFromLink(
            String(req.body.image).trim(),
            path.join(pathImage, filename)
          );
        }
        return FormatResponse.success(res, data);
      } catch (error) {
        return FormatResponse.failure(res, error);
      }
    }
    return FormatResponse.success(res, {}, "Không có gì để cập nhật!");
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
module.exports = new TutorController();
