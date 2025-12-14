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

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.text || req.body.message?.text || "";
    const from = req.body.from || req.body.sender?.id || "";

    if (!message || !from) {
      return res.status(400).send("Bad request: missing fields");
    }

    const lang = detectLanguage(message);
    const product = findProduct(message);
    const reply = replyText(lang, product);

    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: { body: reply }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.sendStatus(500);
  }
});

