const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const loginRouter = require("./routes/login.routes");
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const messageRouter = require("./routes/message.routes");
const exerciseRouter = require("./routes/exercise.routes");
const profileRouter = require("./routes/profile.routes");
const uploadRouter = require("./routes/upload.routes");

const app = express();

dotenv.config();
const url = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/login", loginRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/chat", messageRouter);
app.use("/api/exercise", exerciseRouter);
app.use("/api/profile", profileRouter);
app.use("/api/upload", uploadRouter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AdaPT",
      version: "1.0.0",
      description: "API",
    },
  },
  apis: ["./routes/*.js", "./models/*.js"],
};
const openapiSpecification = swaggerJsdoc(options);
app.use(
  "/api/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiSpecification)
);

app.get("/api/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(openapiSpecification);
});

app.get("/api/*", (_, res) => {
  res.status(404).send("endpoint not found");
});

// Start server
const port = process.env.PORT || 8000;
app.listen(port, async () => {
  try {
    if (mongoose.connection.readyState === 0)
      global.db = await mongoose.connect(url);
  } catch (error) {
    console.error(error);
  }
  console.log(`Server running on port:${port}`);
});

module.exports = app; // export for testing
