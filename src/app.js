import dotenv from "dotenv";
import express from "express";
// import cors from "cors";
const app = express();

dotenv.config({
  path: "./.env",
});
const port = process.env.PORT;

import sequelize from "./db/index.js";

// import models
import Course from "./models/courses.model.js";

//routes import

import userRouter from "./routes/user.route.js";
import allCourses from "./routes/course.route.js";

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// routes declaration
app.use("/api/v1", allCourses);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello belal World!");
});

sequelize
  .sync()
  //   .sync({ force: true })
  .then(() => {
    app.on("error", (error) => {
      console.log("Error Event For App !!", error);
    });
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
