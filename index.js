const express = require("express");
const user = require("./routes/user");
const product = require("./routes/product");
const commande = require("./routes/commande");
const activity = require("./routes/activity");
const message = require("./routes/message");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 4422;
const fileUpload = require("express-fileupload");
const app = express();

app.use(cors({
  origin: "*",
  methods: ["POST","GET"]
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload({ createParentPath: true }));
app.use("/images", express.static("./images"));
app.use("/user", user);
app.use("/product", product);
app.use("/commande", commande);
app.use("/activity", activity);
app.use("/message", message);

app.listen(port, (err) => {
  if (err) {
    console.log("Connection error", err);
  } else {
    console.log("Running on port", port);
  }
});
