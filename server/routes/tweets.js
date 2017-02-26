"use strict";

const userHelper    = require("../lib/util/user-helper");

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if(req.session.userId){
          res.status(201).json(tweets);
        } else {
          res.json(tweets);
        }

      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.session.userId) {
      res.status(403).json({ error: 'Unauthenticated request'});
      return;
    }
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    DataHelpers.getUserById(req.session.userId, (err, dbUser) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const user = userHelper.generateUserObject(dbUser[0].name, dbUser[0].handle);
      const tweet = {
        user: user,
        content: {
          text: req.body.text
        },
        created_at: Date.now()
      };

      DataHelpers.saveTweet(tweet, (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).send();
        }
      });
    });




  });

  return tweetsRoutes;

};
