import { Router } from "express";
import userDao from "../dao/userDao.js"
import { comparePasswords, hashPassword } from "../utils/bcryptUtils.js";
import { profileUploadMiddleware } from "../middleware/multer.js";


const userRouter = Router();

userRouter.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = req.session.user;
    const userProfileImage = user.documents && user.documents.find((doc) => doc.name === 'Foto de perfil');
    
    // redirige a home en base al rol de usuario 
    let formAction = '';
    if (user.rol === 'premium') {
      formAction = '/premium/admin';
    } else if (user.rol === 'usuario') {
      formAction = '/products';
    }
    
    res.render('users', { user, userId, userProfileImage, formAction, layout: false, partials: { navbar: "" } });
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para manejar la solicitud POST de edición de usuario
userRouter.post('/:userId/edit', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { first_name, last_name, gender } = req.body; 
      const user = req.session.user;
  
      const updateData = { first_name, last_name, gender };
      const updatedUser = await userDao.updateUserById(userId, updateData);
  
      if (updatedUser) {
        req.session.user = updatedUser;
      } else {

        res.status(500).send('Error al actualizar los datos del usuario');
        return;
      }
  
      res.redirect(`/users/${userId}`);
    } catch (error) {
      console.error('Error al actualizar los datos del usuario:', error);
      res.status(500).send('Error en el servidor');
    }
  });
  
// Ruta para manejar la solicitud POST de cambio de contraseña
userRouter.post('/:userId/change-password', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { newPassword } = req.body; 
  
      const hashedPassword = await hashPassword(newPassword);

      const updateData = { password: hashedPassword };
      const updatedUser = await userDao.updateUserById(userId, updateData);
  
      if (updatedUser) {

        res.redirect(`/users/${userId}`);
      } else {

        res.status(500).send('Error al actualizar la contraseña del usuario');
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña del usuario:', error);
      res.status(500).send('Error en el servidor');
    }
  });

  userRouter.post('/:userId/documents/upload-profile', profileUploadMiddleware, async (req, res) => {
    try {
      const userId = req.params.userId;
      const profileImage = req.file;
  
      if (!profileImage) {
        
        return res.status(400).json({ error: 'Debes cargar una imagen de perfil' });
      }
  
      const existingProfileImage = await userDao.getUserDocumentByName(userId, 'Foto de perfil');
      if (existingProfileImage) {
        await userDao.removeUserDocumentById(userId, existingProfileImage._id);
      }
      const updateData = {
        $push: {
          documents: {
            name: 'Foto de perfil',
            reference: profileImage.filename
          }
        }
      };
      const updatedUser = await userDao.updateUserById(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      req.session.user = updatedUser;
      const userProfileImage = updatedUser.documents && updatedUser.documents.find((doc) => doc.name === 'Foto de perfil');
      res.render('users', { user: updatedUser, message: 'Imagen de perfil cargada exitosamente', userProfileImage, layout: false, partials: { navbar: "" } });  
    } catch (error) {
      console.error('Error al cargar la imagen de perfil:', error);
      res.status(500).send('Error en el servidor');
    }
  });

export default userRouter;
