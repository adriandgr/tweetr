"use strict";

var express = require('express');
var usersRoutes = express.Router();


module.exports = function(DataHelpers) {

  usersRoutes.post("/", (req, res) => {
    if (!req.body.name || !req.body.handle || !req.body.usrPwd) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    DataHelpers.registerUser(req, (err, insertedId) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      req.session.userId = insertedId;
      res.status(201).json({ success: 'welcome to tweeter! logging you in...' });
    });
  });

  usersRoutes.get('/session', (req, res) => {
    if(req.session.userId) {
      DataHelpers.getUserById(req.session.userId, (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        console.log('current session user:', user);
        res.status(200).json({ user: user});
      });
      return;
    }
    res.status(403).json({ msg: 'no user is logged in.' });
  });

  usersRoutes.put("/session", (req, res) => {
    console.log('req', req.body);
    console.log( req.session);
    if (!req.body.handle || !req.body.usrPwd) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    DataHelpers.authUserByHandle(req, (err, user) => {
      if (err) {
        res.status(403).json({ error: err.message });
      } else {
        res.status(201).json({ success: 'logging you in...' });
      }
    });
  });

  usersRoutes.delete("/session", function(req, res) {
    delete req.session.userId;
    res.status(200).json({ success: 'logging you out...' });

  });

  return usersRoutes;

};
