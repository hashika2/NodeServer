const express = require("express");
const app = require("../App");
// app.listen(5000, () => {
//     console.log("Server has started!");
// });
const request = require("supertest");
const { LoginService } = require("../server/services/AuthService");
const mongoose = require("mongoose");

beforeEach((done) => {
  mongoose.connect(
    "mongodb+srv://hashika:hashika@cluster0-qollh.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
  global.Headers = () => ({
    "Content-Type": "application/json",
    "x-device": "PC",
    "x-browser": "Chrome",
  });
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe("Post Endpoints", () => {
  it("should create a new post", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({
        email: "dilan@gmail.com",
        password: "123456",
      })
      .set({
        "Content-Type": "application/json",
        "x-device": "PC",
        "x-browser": "Chrome",
      });
    expect(res.statusCode).toEqual(200);
    // expect(res.body).toHaveProperty('post')
  });
});
