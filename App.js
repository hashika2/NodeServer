const express = require('express')
const app = express()
app.use(express.json());
const router = require("./server/deliveries/controller/auth/index");
const uploadRouter = require("./server/deliveries/controller/upload");
const getUsersRouter = require("./server/deliveries/controller/user");
app.use("/api/user", router);
app.use("/api/user", uploadRouter);
app.use("/api/user", getUsersRouter);

module.exports = app;
