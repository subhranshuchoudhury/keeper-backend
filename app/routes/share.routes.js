const controller = require("../controllers/share.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/share", controller.saveShare);
  app.get("/api/share/:id", controller.getShare);
};
