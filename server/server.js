import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

import jwt from 'jsonwebtoken';

// schema row
import User from './Schema/User.js';

const server = express();
let PORT = 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

// select which data to send to the frontend that you want
const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
    // password: user.personal_info.hashed_password,
  };
};

// check duplicate usernames
const generateUsername = async (email) => {
  let username = email.split('@')[0];

  let isUserNameNotUnique = await User.exists({
    'personal_info.username': username,
  }).then((result) => result);

  isUserNameNotUnique ? (username += nanoid().substring(0, 5)) : '';

  return username;
};

server.post('/signup', (req, res) => {
  let { fullname, email, password } = req.body;

  //   validating data from frontend
  if (fullname.length < 4) {
    return res
      .status(403)
      .json({ error: 'Full name must be more than four letters long.' });
  }
  //   validate email
  if (!email.length) {
    return res.status(403).json({ error: 'Enter your email please' });
  }
  //   check email pattern: reg ex
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: 'email is invalid' });
  }
  //   check password
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        'Password should be 6 to 20 characters long with numeric, 1 lowercase and 1 uppercase letters',
    });
  }
  //   hash password
  bcrypt.hash(password, 10, async (err, hashed_password) => {
    // take username from email
    let username = await generateUsername(email);

    let user = new User({
      personal_info: {
        fullname,
        email,
        password: hashed_password,
        username,
      },
    });
    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDatatoSend(user));
      })

      // .catch((err) => {
      //   return res.status(500).json({ error: err.message });
      // });
      .catch((err) => {
        if (err.code == 11000) {
          return res
            .status(500)
            .json({ error: 'email already exists:from azarea' });
        }
      });
    console.log(hashed_password);
  });

  // return res.status(200).json({ status: 'okay' });
});

server.post('/signin', (req, res) => {
  let { email, password } = req.body;

  // check if the email exists and find the document
  User.findOne({ 'personal_info.email': email })
    .then((user) => {
      // if the email the user enters does not exist then throw an error
      if (!user) {
        // throw 'error';
        return res.status(403).json({ error: 'email not found:from azarea' });
      }

      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        // if we have a technical error
        if (err) {
          return res.status(403).json({
            error: 'error occured during login, please try again: from azarea.',
          });
        }
        // if the password is incorrect
        if (!result) {
          return res
            .status(403)
            .json({ error: 'incorrect password: from azarea' });
        }
        // if the password matches
        else {
          // the function will take in the user and return the wanted data to the front end
          return res.status(200).json(formatDatatoSend(user));
        }
      });

      // console.log(user);
      // return res.json({ status: 'got user document' });
    })

    // catch error from mongo db: server error
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.listen(PORT, () => {
  console.log('listening on port --->' + PORT);
});
