"use strict";

var express = require('express');
var usersRoutes = express.Router();


module.exports = function(DataHelpers) {

  usersRoutes.post("/session", function(req, res) {
    console.log('req', req.body)
    if (!req.body.uname || !req.body.usr-pwd) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const uname = req.body.uname ? req.body.uname : userHelper.generateRandomUser();

    DataHelpers.getUserById(uname, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  usersRoutes.delete("/session", function(req, res) {


  });

  return usersRoutes;

};
