const db = require("../models");
const User = db.user;
const mongoose = require("mongoose");
// retrieve user's keeps

exports.keeps = (req, res) => {
  User.aggregate(
    [
      // Match with the user
      { $match: { _id: mongoose.Types.ObjectId(req.userId) } },
      // Unwind the 'keeps' array to get a separate document for each 'keep'
      { $unwind: "$keeps" },
      // Sort the documents by the 'timestamp' field in descending order
      { $sort: { "keeps.timestamp": -1 } },
      // Group the documents back into the 'keeps' array
      { $group: { _id: "$_id", keeps: { $push: "$keeps" } } },
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "error on server",
          err,
        });
        return;
      }
      res.status(200).send(result);
    }
  );
};

// particular keep

exports.getKeep = (req, res) => {
  if (!req.params.keepId || req.params.keepId === "") {
    res.status(400).json({
      message: "keep id is missing",
    });
    return;
  }
  User.aggregate(
    [
      // Match the documents that have the specified _id
      { $match: { _id: mongoose.Types.ObjectId(req.userId) } },
      // Unwind the 'keeps' array to get a separate document for each 'keep'
      { $unwind: "$keeps" },
      // Match the documents in the 'keeps' array that have the specified _id
      { $match: { "keeps._id": mongoose.Types.ObjectId(req.params.keepId) } },
      { $group: { _id: "$_id", keeps: { $push: "$keeps" } } },
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "server error",
          err,
        });
        return;
      }
      res.status(200).send(result);
    }
  );
};

// crete user's keep

exports.createKeep = (req, res) => {
  if (
    !req.params.title ||
    req.body.title === "" ||
    !req.body.content ||
    req.body.content === ""
  ) {
    res.status(400).json({
      message: "unsuccessful, empty field",
    });
    return;
  }
  const title = req.body.title;
  const content = req.body.content;
  const timestamp = new Date().getTime();
  const userId = req.userId;

  // save the data into mongodb.
  User.updateOne(
    { _id: userId },
    {
      $push: {
        keeps: {
          title,
          content,
          timestamp,
        },
      },
    },
    (err) => {
      if (err) {
        res.status(400).send({ message: "request not saved" });
      }
    }
  );

  res.status(200).send({ message: "request saved" });
};

// update user's keep

exports.updateKeep = (req, res) => {
  const userId = req.userId;
  const keepId = req.body.keepId;
  const title = req.body.title;
  const content = req.body.content;
  const timestamp = new Date().getTime();

  User.findOneAndUpdate(
    {
      _id: userId,
      "keeps._id": keepId,
    },
    {
      $set: {
        "keeps.$.title": title,
        "keeps.$.content": content,
        "keeps.$.timestamp": timestamp,
      },
    },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "update successful" });
    }
  );
};

// delete user's keep

exports.deleteKeep = (req, res) => {
  if (!req.body.reqid || req.body.reqid === "") {
    res.status(400).json({
      message: "request unsuccessful, empty field",
    });
    return;
  }
  const request_id = req.body.reqid;
  const userId = req.userId;
  const title = "";
  const content = "";
  const timestamp = "";
  User.updateOne(
    { _id: userId, "keeps._id": request_id },
    {
      $unset: {
        "keeps.$[keep]": {
          title,
          content,
          timestamp,
        },
      },
    },
    {
      arrayFilters: [
        {
          "keep._id": request_id,
        },
      ],
    },
    (err) => {
      if (err) {
        res.status(500).json("request not saved");
      } else {
        res.status(200).json("request saved");
      }
    }
  );
};

// engagement from user

exports.userKeepEngagement = async (req, res) => {
  const keepId = req.body.keepId;
  const email = req.body.email;
  const reaction = req.body.reaction;

  User.updateOne(
    // Match the user document and the keep document based on their _id
    {
      "keeps._id": mongoose.Types.ObjectId(keepId),
    },
    // Use $addToSet to push the new engagement object to the engagement array, but only if it doesn't already exist
    { $addToSet: { "keeps.$[keep].engagement": { email, reaction } } },
    // Specify the arrayFilters option to target the specific 'keep' object in the 'keeps' array
    {
      arrayFilters: [{ "keep._id": mongoose.Types.ObjectId(keepId) }],
    },
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "server error",
          err,
        });
        return;
      }
      res.status(200).send(result);
    }
  );
};
// check the x-access-token verified or not

exports.isVerified = (req, res) => {
  res.status(200).send({ success: true });
};

// exports.userBoard = (req, res) => {
//   User.find((err, user) => {
//     if (!err) {
//       res.send(user);
//     }
//   });
// };

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };
