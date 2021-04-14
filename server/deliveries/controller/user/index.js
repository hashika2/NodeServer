const express = require("express");
const authenticateJWT = require("../autherization/autherization");
const router = express.Router();

router.get("/getUser", authenticateJWT, (req, res) => {
  res.send(
    {
     name:"Hashika Maduranga",
     email:"m.g.hashikamaduranga@gmail.com"
    },
  );
});

module.exports = router;
