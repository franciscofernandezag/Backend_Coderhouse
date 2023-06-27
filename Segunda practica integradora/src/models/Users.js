import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: false,
        index: false
    },
    gender: {
        type: String,
        required: false
    },

    rol: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    usernamegithub: {
        type: String,
        required: false
    },
    authenticationType: {
        type: String,
        required: true
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: "cart",
      
      },
});

export const userModel = model("users", userSchema);