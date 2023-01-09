const db = require("mysql2");
const connexion = db.createConnection(
  'mysql://6vgoeytdhgwvpoyt44fu:pscale_pw_8SyduNiZQiAShHehN5vD0aJLaDKKDvdV4oj9coK6LVq@us-east.connect.psdb.cloud/tommymysql?ssl={"rejectUnauthorized":true}'
);
module.exports = connexion;
