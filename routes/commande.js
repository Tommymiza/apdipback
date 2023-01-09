const express = require("express");
const router = express.Router();
const db = require("../db");

router
  .get("/", (req, res) => {
    const sql = "SELECT name, tel, place, id FROM commande GROUP BY tel";
    db.query(sql, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  })
  .get("/nom", (req, res) => {
    const sql =
      "SELECT produit.name, commande.qte, produit.unit, commande.id, produit.price, (produit.price * commande.qte) as total, produit.photo, commande.livre, commande.place, commande.tel FROM commande, produit WHERE (commande.idProd = produit.idProd) AND commande.tel = ?";
    db.query(sql, [req.query.tel], (err, resultat) => {
      if (err) {
        res.send(err);
      } else {
        resultat.forEach((item) => {
          item.photo = item.photo.split(";");
        });
        res.send(resultat);
      }
    });
  })
  .post("/add", async (req, res) => {
    const { list, tel, place, name } = req.body;
    let i = 0;
    var captError = [];
    while (i < list.length) {
      await new Promise((resolve, reject) => {
        db.query(
          "SELECT name, stock FROM produit WHERE idProd = ?",
          [list[i].id],
          (err, resultat) => {
            const diff = resultat[0].stock - list[i].qte;
            db.query(
              "UPDATE produit SET stock = ? WHERE idProd = ?",
              [diff, list[i].id],
              (err, resul) => {
                if (err) {
                  console.log(err);
                  captError.push({ data: err, name: resultat[0].name });
                  resolve(err);
                } else {
                  const sql = `INSERT INTO commande (idProd, qte, tel, place, name, livre) VALUES (?,?,?,?,?,'non')`;
                  db.query(
                    sql,
                    [list[i].id, list[i].qte, tel, place, name],
                    (err, resultat) => {
                      if (err) {
                        res.send(err);
                      } else {
                        resolve(resultat);
                      }
                    }
                  );
                }
              }
            );
          }
        );
      });
      i = i + 1;
    }
    console.log("add finished!");
    if (captError.length !== 0) {
      res.send(captError);
    } else {
      res.send({ status: "finished!" });
    }
  })
  .post("/update", async (req, res) => {
    const { list, name } = req.body;
    var captError = [];
    let i = 0;
    while (i < list.length) {
      await new Promise((resolve, reject) => {
        const sql = "UPDATE commande SET livre = 'oui' WHERE id = ?";
        db.query(sql, [list[i].id], (err, resultat) => {
          if (err) {
            console.log(err);
            captError.push({ data: err });
            reject(err);
          } else {
            resolve(resultat);
          }
        });
      });
      i = i + 1;
    }
    console.log("update finished!");
    if (captError.length !== 0) {
      res.send(captError);
    } else {
      const sql =
        "SELECT produit.name, commande.qte, produit.unit, commande.id, produit.price, (produit.price * commande.qte) as total, produit.photo, commande.livre, commande.place, commande.tel FROM commande, produit WHERE (commande.idProd = produit.idProd) AND commande.name = ?";
      db.query(sql, [name], (err, resultat) => {
        if (err) {
          res.send(err);
        } else {
          resultat.forEach((item) => {
            item.photo = item.photo.split(";");
          });
          res.send(resultat);
        }
      });
    }
  })
  .post("/delete", async (req, res) => {
    const { list, name } = req.body;
    var captError = [];
    let i = 0;
    while (i < list.length) {
      await new Promise((resolve, reject) => {
        const sql = "DELETE FROM commande WHERE id = ?";
        db.query(sql, [list[i].id], (err, resultat) => {
          if (err) {
            console.log(err);
            captError.push({ data: err });
            reject(err);
          } else {
            resolve(resultat);
          }
        });
      });
      i = i + 1;
    }
    console.log("Delete finished!");
    if (captError.length !== 0) {
      res.send(captError);
    } else {
      const sql =
        "SELECT produit.name, commande.qte, produit.unit, commande.id, produit.price, (produit.price * commande.qte) as total, produit.photo, commande.livre, commande.place, commande.tel FROM commande, produit WHERE (commande.idProd = produit.idProd) AND commande.name = ?";
      db.query(sql, [name], (err, resultat) => {
        if (err) {
          res.send(err);
        } else {
          resultat.forEach((item) => {
            item.photo = item.photo.split(";");
          });
          res.send(resultat);
        }
      });
    }
  });

module.exports = router;
