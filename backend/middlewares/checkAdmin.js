function checkAdmin(req, res, next) {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).send('Solo el administrador puede hacer esto');
  }
}

module.exports = checkAdmin;
