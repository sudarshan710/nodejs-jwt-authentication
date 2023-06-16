const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

app.listen(5000, () => console.log("Server running..."));
app.use(express.json());

//mongoose.connect(process.env.DB_CONNECTION, () => console.log('Connected to database!'));

async function connectToDatabase() {

  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Connected to the database!");
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
  }
}

connectToDatabase();

const authRoute = require("./routes/auth");

app.use("/api/user", authRoute);
