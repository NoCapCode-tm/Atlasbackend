import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const connectioninstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`
    );

    console.log(
      `Database Connected\nDB host = ${connectioninstance.connection.host}`
    );
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    throw error;
  }
};

export { connectdb };