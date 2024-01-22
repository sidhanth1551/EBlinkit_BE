import mongoose from "mongoose";

const orderScheme = mongoose.Schema(
  {
    productId: {
      type: String,
      index: true,
      required: [true, "product Id required"],
    },
    userId: {
      type: String,
      required: [true, "userId required"],
    },
    addressId: {
      type: String,
      index: true,
      required: [false, "addressId optional"],
    },
    amountPaid: {
      type: String,
      required: [true, "amount required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Orders", orderScheme);
