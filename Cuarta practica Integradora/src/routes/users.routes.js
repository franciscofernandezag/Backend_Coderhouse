import { Router } from "express";
import userDao from "../dao/userDao.js"
import { comparePasswords, hashPassword } from "../utils/bcryptUtils.js";


const userRouter = Router();



// Ruta para mostrar la vista de usuario y manejar la actualización
userRouter.get('/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = req.session.user; 
      res.render('users', { user, userId, layout: false, partials: { navbar: "" } });
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
  
      // Obtén el usuario actual
      const user = req.session.user;
  
      // Actualiza los campos distintos a la contraseña
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


export default userRouter;
