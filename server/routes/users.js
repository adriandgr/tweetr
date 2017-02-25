"use strict";

var express = require('express');
var usersRoutes = express.Router();


module.exports = function(DataHelpers) {

  usersRoutes.put("/session", function(req, res) {
    console.log('req', req.body);
    console.log( req.session);
    if (!req.body.uname || !req.body.usrPwd) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    DataHelpers.getUserByUname(req, (err, user) => {
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
