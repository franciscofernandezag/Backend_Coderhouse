import { Router } from "express";
import { userModel } from "../models/Users.js";

const recoveryRouter = Router();

recoveryRouter.get("/", async (req, res) => {
  try {
    const email = req.query.email;
    const timestampNow = Date.now();
    const timestampLink = parseInt(req.query.timestamp);

    // Verifica si el enlace ha expirado (1 hora = 3600000 ms)
    if (timestampNow - timestampLink > 3600000) {
      // Si el enlace ha expirado, redirige a una vista para generar un nuevo correo
      return res.render('linkexpired', { email: email });
    }

    // Renderiza la vista para cambiar la contraseña
    res.render('changepassword', { email: email });

  } catch (error) {
    res.status(500).send("Error al recibir los productos:");
  }
});

recoveryRouter.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const newPassword = req.body.newPassword;

    // Realiza aquí la lógica para cambiar la contraseña en la base de datos
    // Por ejemplo, puedes usar bcrypt para encriptar la nueva contraseña y guardarla en el usuario

    // Luego de cambiar la contraseña, redirige a una vista de éxito
    res.render('passwordchanged', { email: email });

  } catch (error) {
    res.status(500).send("Error al recibir los productos:");
  }
});

export default recoveryRouter;
