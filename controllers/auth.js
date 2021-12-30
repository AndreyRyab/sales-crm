const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const keys = require('../config/keys');

const errorHandler = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
    if (passwordResult) {
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id,
        },
        keys.jwt,
        { expiresIn: 60 * 60 },
      );
      res.status(200).json({
        message: 'Token is ready',
        token: `Bearer ${token}`,
      });
    } else {
      res.status(401).json({ message: 'User or password not found' });
    }
  } else {
    res.status(404).json({ message: 'User or password not found' });
  }
};

module.exports.register = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    res.status(409).json({
      message: 'The email has been already used. Please, try another one.',
    });
  } else {
    const salt = bcrypt.genSaltSync(keys.saltValue);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
    });

    try {
      await user.save();
      res.status(201).json({
        message: 'Awsome! New user has been created.',
        user,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
};
