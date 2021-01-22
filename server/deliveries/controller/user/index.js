const express = require("express");
const authenticateJWT = require("../autherization/autherization");
const router = express.Router();

router.get("/getUsers", authenticateJWT, (req, res) => {
  res.send([
    {
      user: {
        name: "hashika1",
      },
    },
    {
      user: {
        name: "hashika2",
      },
    },
  ]);
});

module.exports = router;
