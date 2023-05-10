const db = require("../models");
const Share = db.share;

exports.saveShare = (req, res) => {
  const share = new Share({
    title: req.body.title,
    content: req.body.content,
    timestamp: req.body.timestamp,
    sharedon: new Date().getTime(),
    creator: req.body.creator,
  });

  share
    .save()
    .then((r) => {
      res.send({
        status: "success",
        data: r,
      });
    })
    .catch((e) => {
      res.send({
        status: "failure",
        data: e,
      });
    });
};

exports.getShare = (req, res) => {
  const id = req.params.id || "0";

  Share.findById({ _id: id })
    .then((r) => {
      res.send({
        status: "success",
        data: r,
      });
    })
    .catch((e) => {
      res.send({
        status: "failure",
        data: e,
      });
    });
};
