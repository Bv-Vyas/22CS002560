const express = require("express");
const { Log } = require("../logging_middleware/logger.js");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  Log("backend", "error", "handler", "received string, expected bool");
  res.send("This is home page");
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
