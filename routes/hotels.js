import express from "express";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const newHotel = new Hotel(req.body);
  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

//req param i.e. id take
router.put("/:id", async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        //set method of mongodb
        $set: req.body,
      },
      {
        //this will return the updated version on insomnia
        new: true,
      }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // do not store in a variable -> this will just delete, no need to return
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // do not store in a variable -> this will just delete, no need to return
    const reqHotel = await Hotel.findById(req.params.id);
    res.status(200).json(reqHotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res, next) => {
  console.log("hi im a hotel route");
  next();
  // if we write -> res.send() in index.js middleware with next  toh yahan return next() karna hoga

  // const failed = true;
  // Method 1 // const err = new Error();
  // err.status = 404;
  // err.message = "Sorry Not found!";
  // if (failed) return next(err);

  // Method 2 // if (failed) return next(createError(401, "You are not authenticated"));

  try {
    // do not store in a variable -> this will just delete, no need to return
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (err) {
    // res.status(500).json(err);
    next(err);
  }
});

export default router;
