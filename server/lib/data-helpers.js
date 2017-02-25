"use strict";

const ObjectID   = require('mongodb').ObjectID;
const bcrypt     = require('bcrypt');
const saltRounds = 12;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray(callback);
    },

    getUserById: function(userId, callback) {
      db.collection("users").find({'_id': ObjectID(`${userId}`)}).toArray( (err, result) => {
        if (err) {
          return callback(err);
        }
        delete result[0].usrPwd;
        callback(null, result);
      });
    },

    authUserByUname: function(pReq, callback) {
      db.collection("users").find({uname: pReq.body.uname}).toArray( (err, result) => {
        if (err) {
          return callback(err);
        }

        if (!result.length) {
          console.log('auth failure :/  >> no user found');
          return callback(new Error('Authentication failure'), null);
        }
        bcrypt.compare(pReq.body.usrPwd, result[0].usrPwd, function(err, pass) {
          if (pass) {
            pReq.session.userId = result[0]['_id'];
            console.log('success! set session to:', pReq.session.userId );
            return callback(null, result);
          }
          console.log('auth failure :/  >> hash compare failed');
          callback(new Error('Authentication failure'), null);
        });
      }); // end of db.collection

    },
    registerUser: function(pReq, callback) {
      console.log('pReq', pReq.session);
      db.collection("users").find({uname: pReq.body.uname}).toArray( (err, result) => {
        if (err) {
          return callback(err);
        }

        if (result.length > 0) {
          console.log('mongoHash', result[0].usrPwd);
          bcrypt.compare(pReq.body.usrPwd, result[0].usrPwd, function(err, pass) {
            if (pass) {
              pReq.session.userId = result[0]['_id'];
              console.log('success! set session to:', pReq.session.userId );
              //res.redirect('/');
              callback(null, result);
            } else {
              console.log('auth failure :/  >> hash compare failed');
              callback(new Error('Authentication failure'), null);
            }
          });
        } else {
          console.log('auth failure :/  >> no user found');
          callback(new Error('Authentication failure'), null);
        }

      }); // end of db.collection

    }
  };
};

