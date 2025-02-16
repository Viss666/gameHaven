const express = require("express");
const cors = require("cors");

const app = express();

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

app.listen(8080, function () {
  console.log("Server is running...");
});
