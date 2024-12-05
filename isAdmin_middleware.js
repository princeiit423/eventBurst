isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.username === 'iei786') {
      return next();
    }
    res.render("unauth/unauth.ejs");
  };
  
  module.exports = isAdmin ;
  