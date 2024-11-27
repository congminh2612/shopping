const mongoose = require("mongoose");
require("dotenv").config();
const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected 🟢");
  } catch (error) {
    console.error("Error connecting to MongoDB 🔴:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
