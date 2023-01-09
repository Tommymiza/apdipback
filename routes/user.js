const express = require("express");
const router = express.Router();
const db = require("../db");

router
  .get("/", (req, res) => {
    const {username, password} = req.query;
    const sql = "SELECT * FROM personnel WHERE username = ?";
    db.query(sql, [username], (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.length !== 0) {
          const sql =
            "SELECT * FROM personnel WHERE username = ? AND password = ?";
          db.query(
            sql,
            [username, password],
            (err, result) => {
              if (err) {
                res.send(err);
              } else {
                if (result.length !== 0) {
                  res.send(result);
                } else {
                  res.send({ status: "Wrong password!" });
                }
              }
            }
          );
        } else {
          res.send({ status: "No username found!" });
        }
      }
    });
  })
  .get("/byid", (req, res) => {
    const sql = "SELECT * FROM personnel WHERE id = ?";
    db.query(sql, [req.query.id], (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.length !== 0) {
          res.send(result);
        } else {
          res.send({ status: "Invalid access key!" });
        }
      }
    });
  });

module.exports = router;
