const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const users = require('./user');
const express= require('express')
const app = express()
const router = express.Router();
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false })) 
// app.use(bodyParser.json())
// app.use(express.json)

const createTokenSendResponse = (user, res, next) => {
  const payload = {
    _id: user._id,
    username: user.username,
    role: user.role,
    active: user.active,
  };
  jwt.sign(
    payload,
    '123', {
      expiresIn: '10 years',
    }, (err, token) => {
      if (err) {
        res.status(422);
        const error = Error('Unable to login');
        next(error);
      } else {
      // login all good
        res.json({ token });
      }
    },
  );
};

const get = (req, res) => {
  res.json({
    message: 'Hello Auth! 🔐',
  });
};

const signup = async (req, res, next) => {
  try {
   
  let userData = req.body;
  console.log(userData);
  let user = new users(userData);
     user.save((err, newuser) => {
      if (err)
      res.json({success:false, msg: 'failed to register user'});
      else
      res.status(200).json({newuser})
      //createTokenSendResponse(newuser, res, next);

  });
   
    
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await bcrypt.compare(
      req.body.password,
      req.loggingInUser.password,
    );
    if (result) {
      createTokenSendResponse(req.loggingInUser, res, next);
    } else {
      res.status(422);
      throw new Error('Unable to login');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    next(error);
  }
};

module.exports = {
  get,
  login,
  signup,
};