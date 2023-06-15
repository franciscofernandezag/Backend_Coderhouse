import { Schema, model } from "mongoose";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    index: true
  },
  gender: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  authenticationType: {
    type: String,
    required: true,
    default: "local" // Valor predeterminado "local"
  }
});

export const userModel = model("users", userSchema);
