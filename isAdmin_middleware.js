isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.username === 'iei786') {
      return next();
    }
    res.status(403).send('Unauthorized, go back!');
  };
  
  module.exports = isAdmin ;
  