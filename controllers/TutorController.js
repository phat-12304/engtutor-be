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
      return FormatResponse.error(res, "Không có mã giáo viên!");
    try {
      const data = await Tutor.findOne({ _id: req.params.id });
      if (!data) return FormatResponse.error(res, "Không tìm thấy giáo viên!");

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
}
module.exports = new TutorController();
