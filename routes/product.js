const express = require("express");
const router = express.Router();
const db = require("../db");
const path = require("path");
const fs = require("fs");

router
  .get("/", (req, res) => {
    const sql =
      "SELECT idProd as id, name, price, unit, stock, photo FROM produit";
    db.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        result.forEach((item) => {
          const array = item.photo.split(";");
          item.photo = array;
        });
        res.send(result);
      }
    });
  })
  .post("/add", (req, res) => {
    const files = req.files;
    const { name, price, unit, stock } = req.body;
    const nameFile = [];
    Object.keys(files).forEach((file) => {
      const name_array = file.split(".");
      const file_name = name_array[0];
      const file_ext = name_array[1];
      const exact_filename = file_name + "-" + Date.now() + "." + file_ext;
      const filepath = path.join(__dirname, "../images", exact_filename);
      files[file].mv(filepath, (err) => {
        if (err) {
          console.log("error d'ajout", typeof err);
          res.send(err);
        }
      });
      nameFile.push(exact_filename);
    });
    console.log("file added!");
    const sql =
      "INSERT INTO produit (name, price, unit, stock, photo) VALUES (?, ?, ?, ?, ?)";
    db.query(
      sql,
      [name, price, unit, stock, nameFile.join(";")],
      (err, result) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          res.send(result);
          console.log("Added to database!");
        }
      }
    );
  })
  .post("/update", (req, res) => {
    const { name, price, stock, unit, id } = req.body;
    console.log("Update begin");
    const sql =
      "UPDATE produit SET name = ?, price = ?, unit = ?, stock = ? WHERE idProd = ?";
    db.query(sql, [name, price, unit, stock, id], (err, result) => {
      if (err) {
        res.send(err);
        console.log(err);
      } else {
        console.log("update finished!");
        res.send(result);
      }
    });
  })
  .post("/delete", (req, res) => {
    const { id, photo } = req.body;
    const sql = "DELETE FROM produit WHERE idProd = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted from database!");
        const promise = [];
        photo.forEach((item) => {
          promise.push(
            fs.unlink("./images/" + item, (err) => {
              if (err) {
                console.log(err);
              }
            })
          );
        });
        Promise.all(promise)
          .then(() => {
            console.log("deleted files!");
            res.send(result);
          })
          .catch((err) => {
            res.send(err);
          });
      }
    });
  });

module.exports = router;
