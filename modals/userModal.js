import mongoose from "mongoose";

const userScheme = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "pls add username"],
    },
    email: {
      type: String,
      required: [true, "pls add email"],
    },
    password: {
      type: String,
      required: [true, "password pls"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userScheme);
