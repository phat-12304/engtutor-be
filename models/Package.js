const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    popular: {
      type: Boolean,
      required: false,
      default: false,
    },
    is_try: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.updatedAt;
    delete ret._id;
    return ret;
  },
});

const Package = mongoose.model("package", packageSchema);

module.exports = Package;
