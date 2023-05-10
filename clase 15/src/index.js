import express from "express";
import mongoose, { Schema } from "mongoose";

const app = express()

mongoose.connect("mongodb+srv://fcofernandezag:5372220ffa@cluster0.b3tsotp.mongodb.net/?retryWrites=true&w=majority")
.then(() => console.log("DB is connected"))
.catch((error) => console.log("Errror en MongoDB Atlas :", error))


