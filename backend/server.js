const express = require("express");
const { Log } = require("./logging_middleware/logger.js");
const crypto = require("crypto");
const app = express();

app.use(express.json());

// In-memory DB
let urlStore = {}; // { shortcode: { url, expiry, createdAt, clicks: [] } }

// Helper: Generate random shortcode
function generateShortcode(length = 6) {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
}

// Middleware: Logging
app.use((req, res, next) => {
  Log("backend", "info", req.method, `Request: ${req.originalUrl}`);
  next();
});

/**
 * POST /shorturls
 * Create a new shortened URL
 */
app.post("/shorturls", (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url || typeof url !== "string") {
      Log("backend", "error", "POST /shorturls", "Invalid URL input");
      return res.status(400).json({ error: "Invalid URL" });
    }

    // Validity in minutes (default 30)
    const validityMinutes =
      validity && Number.isInteger(validity) ? validity : 30;
    const expiry = new Date(Date.now() + validityMinutes * 60 * 1000);

    // Generate or validate shortcode
    let code = shortcode || generateShortcode();
    if (urlStore[code]) {
      return res.status(400).json({ error: "Shortcode already exists" });
    }

    // Save
    urlStore[code] = {
      url,
      expiry,
      createdAt: new Date(),
      clicks: [],
    };

    const shortLink = `http://localhost:8080/${code}`;
    Log(
      "backend",
      "info",
      "POST /shorturls",
      `Created shortLink: ${shortLink}`
    );

    return res.status(201).json({
      shortLink,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    Log("backend", "error", "POST /shorturls", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * GET /:shortcode
 * Redirect to original URL
 */
app.get("/:shortcode", (req, res) => {
  const { shortcode } = req.params;
  const record = urlStore[shortcode];

  if (!record) {
    return res.status(404).json({ error: "Shortcode not found" });
  }

  if (new Date() > record.expiry) {
    return res.status(410).json({ error: "Link expired" });
  }

  // Save click data
  record.clicks.push({
    timestamp: new Date(),
    referrer: req.get("Referer") || "direct",
    ip: req.ip,
  });

  Log("backend", "info", "REDIRECT", `Redirecting to ${record.url}`);
  return res.redirect(record.url);
});

/**
 * GET /shorturls/:shortcode
 * Retrieve statistics for short URL
 */
app.get("/shorturls/:shortcode", (req, res) => {
  const { shortcode } = req.params;
  const record = urlStore[shortcode];

  if (!record) {
    return res.status(404).json({ error: "Shortcode not found" });
  }

  return res.json({
    shortcode,
    url: record.url,
    createdAt: record.createdAt,
    expiry: record.expiry,
    totalClicks: record.clicks.length,
    clickData: record.clicks,
  });
});

const PORT = 8080;
app.listen(PORT, () => {
  Log("backend", "info", "SERVER", `Running on port ${PORT}`);
});
