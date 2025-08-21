const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema(
  {
    keywords: {
      type: String,
      required: true,
    },
    contents: {
      type: String,
      required: true,
    },
    is_public: {
      type: Boolean,
      required: false,
      default: false,
    },
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

researchSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.updatedAt;
    delete ret._id;
    return ret;
  },
});

const Research = mongoose.model("research", researchSchema);

module.exports = Research;
