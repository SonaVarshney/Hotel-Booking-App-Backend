import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

//can name anything  -> while importing a file in express use.js at end and this is not to be done when importing libraries
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";

//nodejs mein vaise aisa karta hai const express=require("express");s
const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB");
  } catch (error) {
    throw error;
  }
};

//this above thing will just connect with mongodb once, if there is an error it will not try to connect again and again

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});

mongoose.connection.on("connected", () => {
  console.log("mongoDB connected");
});

//main page endpoint, express takes a req and res paramter and use it in any request
// req comes from user and res is sent by the api end point
app.get("/", (req, res) => {
  res.send("hello, first request!");
});

//middlewares - it is able to reach our response and request before sending anything to the user
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((req, res, next) => {
  console.log("Hi im a middleware"); // isme just cout hoga in terminal
  // res.send("hello from middleware"); // toh yeh user ko response de dega
});

// error handling middleware -> handling error with express
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMsg = err.message || "Something went wrong";

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMsg,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("connected to backend!");
});
