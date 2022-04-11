const express = require("express");
const cors = require("cors");

const app = express();
const lib = require("./dbOperations");
const loginRouter = require("./routes/login/routes");
const userRouter = require("./routes/user/routes");

const url =
  "mongodb+srv://adapt:adapt@cluster0.bmk3y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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

// Default response for any other request
app.use((_req, res) => {
  res.status(404);
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, async () => {
  db = await lib.connect(url);
  app.set("db", db);
  console.log(`Server running on port:${port}`);
});

module.exports = app; // export for testing
