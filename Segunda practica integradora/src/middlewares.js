export function authenticate(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/');
    }
  }
  
  