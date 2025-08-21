const FormatResponse = require("../services/response");
const Paginate = require("../services/paginate");
const Schedule = require("../models/Schedule");
const Tutor = require("../models/Tutor");

class ScheduleController {
  async getAll(req, res) {
    const sort = { createdAt: -1 };
    try {
      const data = await Paginate.main(req, Schedule, { sort });
      return FormatResponse.pagination(res, data.data, data.paginate);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
  async store(req, res) {
    let { datetime, is_try, id_tutor, id_order } = req.body;

    if (datetime == "")
      return FormatResponse.error(res, "Không được để trống ngày!");

    if (is_try == "")
      return FormatResponse.error(res, "Không được để trống trạng thái thử!");

    if (id_tutor == "")
      return FormatResponse.error(res, "Không được để trống mã giáo viên!");

    if (id_order == "")
      return FormatResponse.error(res, "Không được để trống mã hóa đơn!");

    try {
      const data = await Schedule.create({
        datetime,
        is_try,
        id_tutor,
        id_order,
      });
      return FormatResponse.success(res, data);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
  async getSchedulesOfTutor(req, res) {
    if (!req.params.id)
      return FormatResponse.error(res, "Không có mã giáo viên!");

    const tutorId = req.params.id;
    try {
      const tutor = await Tutor.findOne({ _id: tutorId });
      if (!tutor)
        return FormatResponse.error(res, "Không tìm thấy giáo viên này!");

      const data = await Schedule.find({ id_tutor: tutorId });

      return FormatResponse.success(res, data);
    } catch (error) {
      return FormatResponse.failure(res, error);
    }
  }
  async update(req, res) {
    let update = {};
    if (!req.params.id) return FormatResponse.error(res, "Không có mã lịch!");

    if (req.body.datetime && req.body.datetime != "") {
      const datetime = req.body.datetime;
      update = { ...update, datetime };
    }

    if (req.body.is_try && req.body.is_try != "") {
      const is_try = req.body.is_try;
      update = { ...update, is_try };
    }

    if (req.body.id_tutor && req.body.id_tutor != "") {
      const id_tutor = req.body.id_tutor;
      update = { ...update, id_tutor };
    }

    if (req.body.id_order && req.body.id_order != "") {
      const id_order = req.body.id_order;
      update = { ...update, id_order };
    }

    if (Object.keys(update).length > 0) {
      try {
        const data = await Schedule.findByIdAndUpdate(req.params.id, update, {
          new: true,
        });
        return FormatResponse.success(res, data);
      } catch (error) {
        return FormatResponse.failure(res, error);
      }
    }
    return FormatResponse.success(res, {}, "Không có gì để cập nhật!");
  }
  async getTrySchedules(req, res) {
    if (!req.params.id)
      return FormatResponse.error(res, "Không có mã giáo viên!");

    const tutorId = req.params.id;
    try {
      const tutor = await Tutor.findOne({ _id: tutorId });
      if (!tutor)
        return FormatResponse.error(res, "Không tìm thấy giáo viên này!");

      const data = await Schedule.find({ is_try: true });
      return FormatResponse.success(res, data);
    } catch (error) {}
  }
}
module.exports = new ScheduleController();
