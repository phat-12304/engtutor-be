const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: false,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    id_package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
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

orderSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.updatedAt;
    delete ret._id;
    return ret;
  },
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
