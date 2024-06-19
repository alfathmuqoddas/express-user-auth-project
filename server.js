const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const Role = db.role;

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and resync db");
//   initial();
// });

db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to alfathmuqoddas token-based authentication project using express js",
  });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/transaction.routes")(app);
require("./app/routes/inquiry.routes")(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}
