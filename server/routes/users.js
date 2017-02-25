"use strict";

var express = require('express');
var usersRoutes = express.Router();


module.exports = function(DataHelpers) {

  usersRoutes.get('/session', (req, res) => {
    if(req.session.userId) {
      DataHelpers.getUserById(req.session.userId, (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        console.log('last step user object:', user);
        res.status(200).json({ user: user});
      });
      return;
    }
    res.status(403).json({ msg: 'no user is logged in.' });
  });

  usersRoutes.post("/", (req, res) => {
    console.log('req', req.body);
    console.log( req.session);
    if (!req.body.uname || !req.body.usrPwd) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    DataHelpers.registerUser(req, (err, user) => {
      if (err) {
        console.log(err);
        res.status(403).json({ error: err.message });
        return;
      }
      console.log('last step user object:', user);
      res.status(201).json({ success: 'welcome to tweeter! logging you in...' });
    });
  });

  usersRoutes.put("/session", (req, res) => {
    console.log('req', req.body);
    console.log( req.session);
    if (!req.body.uname || !req.body.usrPwd) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    DataHelpers.authUserByUname(req, (err, user) => {
      if (err) {
        console.log(err)
        res.status(403).json({ error: err.message });
      } else {
        console.log('last step user object:', user);
        res.status(201).json({ success: 'logging you in...' });
      }
    });
  });

  usersRoutes.delete("/session", function(req, res) {
    console.log(req.session);
    delete req.session.userId;
    console.log(req.session);
    res.status(200).json({ success: 'logging you out...' });

  });

  return usersRoutes;

};
