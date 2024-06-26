const express = require("express");
const dbConfig = require("./app/config/db.config");
require("dotenv").config();
const app = express();
// const cors = require("cors");

app.use((req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE",
  });
  next();
});

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

console.log("🔗 Connecting to MongoDB...");
db.mongoose
  .connect(`${dbConfig.URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("📡 Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("⚠️ Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.status(200).json({ message: "server working fine." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/share.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🌍 Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
