const express = require("express");
const app = express();
const port = 8081;
const giftsRouter = require("./routes/gifts");
const cors = require("cors"); //enables cors

app.use(cors());
app.use(express.static("public")); //enables serving files such as images
app.use(express.json()); //enables req.body
app.use(express.urlencoded({ extended: true }));

app.use("/gifts", giftsRouter);

app.listen(8081, function () {
  console.log(`Server running on port ${port}`);
});
