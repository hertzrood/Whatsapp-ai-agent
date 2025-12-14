const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { detectLanguage, findProduct, replyText } = require("./aiAgent");

const app = express();
app.use(bodyParser.json());

// Verification endpoint for Meta
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "1234"; // You can choose any token, just remember it

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
