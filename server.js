const express = require("express");
const axios = require("axios");
const app = express();
const port = 5000;

// Enable CORS for your Next.js app
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Proxy endpoint for FPL API
app.get("/api/fpl/entry/:managerId", async (req, res) => {
  const { managerId } = req.params;
  try {
    const response = await axios.get(`https://fantasy.premierleague.com/api/entry/${managerId}/`);
    res.status(200).json(response.data);
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json({ error: err.response.statusText });
    } else {
      res.status(500).json({ error: "Network error or API unavailable" });
    }
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});