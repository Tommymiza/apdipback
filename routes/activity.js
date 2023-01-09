const express = require("express");
const router = express.Router();
const fs = require("fs");
const db = require("../db");
const path = require("path")

router
  .get("/", (req, res) => {
    const sql = "SELECT * FROM activity";
    db.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        result.forEach((item) => {
          const array = item.photo.split(";");
          const date = new Date(item.date);
          const day =
            date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
          var month = date.getMonth() + 1;
          month = month < 10 ? `0${month}` : month;
          item.date = day + "-" + month + "-" + date.getFullYear();
          item.photo = array;
        });
        res.send(result);
      }
    });
  })
  .post("/add", (req, res) => {
    try {
      const files = req.files;
      const { title, date, place, descri } = req.body;
      const nameFile = [];
      Object.keys(files).forEach((file) => {
        const name_array = file.split(".");
        const file_name = name_array[0];
        const file_ext = name_array[1];
        const exact_filename = file_name + "-" + Date.now() + "." + file_ext;
        const filepath = path.join(__dirname,'../images',exact_filename)
        files[file].mv(filepath, (err) => {
          if(err){
            console.log("error d'ajout",typeof(err))
            res.send(err)
          }
        });
        nameFile.push(exact_filename);
      });
      console.log("file added!");
      const sql =
        "INSERT INTO activity (title, date, place, descri, photo) VALUES (?, ?, ?, ?, ?)";
      db.query(
        sql,
        [title, date, place, descri, nameFile.join(";")],
        (err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
            console.log("Added to database!")
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  })
  .post("/update", (req, res) => {
    const { title, date, place, descri, id } = req.body;
    const sql =
      "UPDATE activity SET title = ?, date = ?, place = ?, descri = ? WHERE id = ?";
    db.query(sql, [title, date, place, descri, id], (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
    console.log("Updated success!")
  })
  .post("/delete", (req, res) => {
    const { id, photo } = req.body;
    const sql = "DELETE FROM activity WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log(err)
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
