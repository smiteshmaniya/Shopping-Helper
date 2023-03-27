const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const connection = require("./config/conn");
// connection();
const cors = require("cors");

const port = process.env.PORT || 5000;

app.use(cookieParser());

const routes = require("./routes/index.routes");

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);

app.listen(port, () => console.log(`server is running on port ${port}`));
