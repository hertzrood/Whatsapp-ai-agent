const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { detectLanguage, findProduct, replyText } = require("./aiAgent");

const app = express();
app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  res.send("Webhook is live");
});

app.post("/webhook", async (req, res) => {
  const message = req.body.text || "";
  const from = req.body.from || "";

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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
