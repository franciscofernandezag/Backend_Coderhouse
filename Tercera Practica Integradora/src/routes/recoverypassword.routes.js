import { Router } from "express";

const recoveryRouter = Router();

recoveryRouter.get("/recoverypassword", async (req, res) => {
    try {
    

        console.log("ingreso ok");

    } catch (error) {
     
      res.status(500).send("Error al recibir los productos:");
    }
  });
  
  export default recoveryRouter;