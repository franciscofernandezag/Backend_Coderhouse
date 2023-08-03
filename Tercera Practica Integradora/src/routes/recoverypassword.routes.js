import { Router } from "express";
import { userModel } from "../models/Users.js";
import { transporter } from "../utils/nodemailer.js";

const recoveryRouter = Router();

recoveryRouter.get("/", async (req, res) => {
  try {
    const email = req.query.email;
    const user = await userModel.findOne({ email });

    if (user) {
      const htmlBody = `<p>Hola ${user.first_name},</p>
                       <p>Para cambiar tu contraseña, haz clic en el siguiente enlace:</p>
                       <a href="http://localhost:4000/changepassword?email=${user.email}">Cambiar Contraseña</a>`;

      await transporter.sendMail({
        to: email,
        subject: "Cambio de contraseña",
        html: htmlBody,
      });

      res.render('mailsended', { email: email });
    } else {
      res.render('unregistrer', { email: email });
    }
  } catch (error) {
    res.status(500).send("Error al recibir los productos:");
  }
});


recoveryRouter.get("/succesful", async (req, res) => {
    try {
      const email = req.query.email;
      const user = await userModel.findOne({ email });
  
      res.render('changesuccesful', { email: email });
  
    } catch (error) {
      res.status(500).send("Error al cambiar la contraseña:");
    }
  });
  

export default recoveryRouter;
