const { authJwt } = require("../middleware");
const controller = require("../controllers/inquiry.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/inquiry", [authJwt.verifyToken], controller.getAccountInfo);
  app.get(
    "/api/inquiry/historical",
    [authJwt.verifyToken],
    controller.getHistoricalTransactions
  );
};
