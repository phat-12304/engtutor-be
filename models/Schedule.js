const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    datetime: {
      type: Date,
      required: true,
    },
    is_try: {
      type: Boolean,
      required: true,
      default: false,
    },
    id_tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
    },
    id_order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

scheduleSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.updatedAt;
    delete ret._id;
    return ret;
  },
});

const Schedule = mongoose.model("schedule", scheduleSchema);

module.exports = Schedule;
