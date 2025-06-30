const express = require("express");
const routes = require("./routes");
const fs = require("fs");
const cors = require("cors");

const app = express(); // ✅ Define app first
const PORT = 5000;

// Enable CORS before any routes
app.use(cors());

// Create required folders if not exist
["uploads", "output", "keyfiles"].forEach(folder => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
});

app.use(express.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
