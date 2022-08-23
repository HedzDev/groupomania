const User = require('../models/User');

exports.uploadProfil = async (req, res) => {
  return res.status(200).json(req.file);
};
