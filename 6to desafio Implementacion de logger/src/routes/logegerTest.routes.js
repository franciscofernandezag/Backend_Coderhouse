import { Router } from "express";
import { logger } from "../utils/logger.js";

const loggerTestRouter = Router();

loggerTestRouter.get("/", (req, res) => {

  logger.fatal("Este es un mensaje de log fatal");
  logger.error("Este es un mensaje de log de error");
  logger.warning("Este es un mensaje de log de advertencia");
  logger.info("Este es un mensaje de log de información");
  logger.http("Este es un mensaje de log HTTP");

  res.send("Registro de prueba de logs completado.");
});

export default loggerTestRouter;
