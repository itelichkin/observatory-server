exports.post = function(req, res, next) {
  const sid = req.session.id;

  req.session.destroy(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
};
