import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_DB_STRING);
    console.log(
      `DB String ${(connect.Connection.host, connect.connection.name)}`
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
