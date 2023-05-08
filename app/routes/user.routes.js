const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // user keeps grt route

  app.get("/api/user/keeps", [authJwt.verifyToken], controller.keeps);

  // user keep post route

  app.post("/api/user/keep", [authJwt.verifyToken], controller.createKeep);

  // user keep get route

  app.get("/api/user/keep/:id", [authJwt.verifyToken], controller.getKeep);

  // user keep put

  app.put("/api/user/keep", [authJwt.verifyToken], controller.updateKeep);

  // user keep delete

  app.delete("/api/user/keep", [authJwt.verifyToken], controller.deleteKeep);

  app.delete(
    "/api/user/keep-new",
    [authJwt.verifyToken],
    controller.deleteKeepNew
  );

  // user engagements

  app.post(
    "/api/user/keep/engagement",
    [authJwt.verifyToken],
    controller.userKeepEngagement
  );

  // check if the user is verified or not

  app.get("/api/verify", [authJwt.verifyToken], controller.isVerified);
};

// Things we are not using right now. 🚧🚧🚧
// moderator update request progress

// app.post(
//   "/api/user/requestprogress",
//   [authJwt.verifyToken, authJwt.isModerator],
//   controller.userRequestProgress
// );

// user engagement

// app.post(
//   "/api/user/requestengagement",
//   [authJwt.verifyToken],
//   controller.userRequestEngagement
// );

// app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

// app.get(
//   "/api/test/mod",
//   [authJwt.verifyToken, authJwt.isModerator],
//   controller.moderatorBoard
// );

// app.get(
//   "/api/test/admin",
//   [authJwt.verifyToken, authJwt.isAdmin],
//   controller.adminBoard
// );
