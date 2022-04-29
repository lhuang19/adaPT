const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const loginRouter = require("./routes/login.routes");
const userRouter = require("./routes/user.routes");
const postRouter = require("./routes/post.routes");
const messageRouter = require("./routes/message.routes");
const dotenv = require("dotenv");

dotenv.config();
const url = process.env.MONGO_URL;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/chat", messageRouter);

app.get("*", function (_, res) {
  res.status(404).send("endpoint not found");
});

// Start server
const port = process.env.PORT || 8000;
app.listen(port, async () => {
  try {
    global.db = await mongoose.connect(url);
  } catch (error) {
    console.error(error);
  }
  console.log(`Server running on port:${port}`);
});

module.exports = app; // export for testing
