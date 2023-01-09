const express = require("express");
const router = express.Router();
const db = require("../db");

router
  .post("/add", (req, res) => {
    const { nom, email, phone, message } = req.body;
    const sql =
      "INSERT INTO message (nom, email, phone, message, lu) VALUES (?, ?, ?, ?, 'non')";
    db.query(sql, [nom, email, phone, message], (err, resultat) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(resultat);
      }
    });
  })
  .get("/", (req, res) => {
    const sql = "SELECT * FROM message ORDER BY lu ASC";
    db.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  })
  .post("/update", async (req, res) => {
    const sql = "UPDATE message SET lu = 'oui' WHERE id = ?";
    await new Promise((resolve, reject) => {
      db.query(sql, [req.body.id], (err, resultat) => {
        if (err) {
          res.send(err);
          reject(err);
        } else {
          const sql = "SELECT * FROM message ORDER BY lu ASC";
          db.query(sql, (err, result) => {
            if (err) {
              res.send(err);
              reject(err);
            } else {
              res.send(result);
              resolve(result);
            }
          });
        }
      });
    });
  })
  .post("/clean", async (req, res) => {
    const { item } = req.body;
    let i = 0;
    while (i < item.length) {
      if (item[i].lu === "oui") {
        await new Promise((resolve, reject) => {
          const sql = "DELETE FROM message WHERE id = ?";
          db.query(sql, [item[i].id], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      }
      i = i + 1;
    }
    const sql = "SELECT * FROM message ORDER BY lu ASC";
    db.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  });

module.exports = router;
