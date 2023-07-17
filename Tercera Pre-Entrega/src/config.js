import dotenv from "dotenv"

dotenv.config ()

export default {

    port: process.env.PORT,
    gmail_user: process.env.gmail_user,
    gmail_password: process.env.gmail_password



}