const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Services = require("../services/services");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: false,
      default: "clone.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.virtual("image_url").get(function () {
  return Services.url_be(`/assets/images/users/${this.image}`);
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret._id;
    return ret;
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
