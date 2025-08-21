const mongoose = require("mongoose");
const Services = require("../services/services");

const tutorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: "clone.jpg",
    },
    nation: {
      type: String,
      required: false,
      default: "Việt Nam",
    },
  },
  {
    timestamps: true,
  }
);

tutorSchema.virtual("image_url").get(function () {
  return Services.url_be(`/assets/images/tutors/${this.image}`);
});

tutorSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.updatedAt;
    delete ret._id;
    return ret;
  },
});

const Tutor = mongoose.model("tutor", tutorSchema);

module.exports = Tutor;
