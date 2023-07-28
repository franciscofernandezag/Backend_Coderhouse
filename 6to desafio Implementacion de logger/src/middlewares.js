// Autentificacion 
export function authenticate(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}


// Winston
export const info = (req, res, next) => {
  req.logger = logger;
  req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);


  next();
};

