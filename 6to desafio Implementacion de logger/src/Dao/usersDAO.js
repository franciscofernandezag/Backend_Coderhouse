import { userModel } from "../models/Users.js";

export const UsersDAO = {
  async findByEmail(email) {
    return userModel.findOne({ email });
  },

  async findById(id) {
    return userModel.findById(id);
  },

  async createUser(user) {
    return userModel.create(user);
  },
};
