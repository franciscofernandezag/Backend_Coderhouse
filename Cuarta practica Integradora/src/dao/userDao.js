import { userModel } from "../dao/models/Users.js";

const userDao = {

  async createUser(userData) {
    try {
      const user = await userModel.create(userData);
      return user; // Devuelve el usuario creado
    } catch (error) {
      throw error;
    }
  },


  async deleteUserById(userId) {
    try {
      const result = await userModel.findByIdAndDelete(userId);
      return result;
    } catch (error) {
      throw error;
    }
  },

  async updateUserById(userId, updateData) {
    try {
      const result = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async getUserIdByUsername(username) {
    try {
      const user = await userModel.findOne({ username });
      if (user) {
        return user._id; 
      } else {
        throw new Error("Usuario no encontrado");
      }
    } catch (error) {
      throw error;
    }
  },

  async findUserByEmail(email) {
    try {
      const user = await userModel.findOne({ email });
      return user; 
    } catch (error) {
      throw error;
    }
  },
  async getUserDocumentByName(userId, documentName) {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const document = user.documents.find((doc) => doc.name === documentName);
      return document;
    } catch (error) {
      throw error;
    }
  },

  async removeUserDocumentById(userId, documentId) {
    try {
      const user = await userModel.findByIdAndUpdate(
        userId,
        { $pull: { documents: { _id: documentId } } },
        { new: true }
      );
  
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
  
      return true; 
    } catch (error) {
      throw error;
    }
  },

};

export default userDao;
