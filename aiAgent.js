const products = require("./products.json");

function detectLanguage(text) {
  if (/prix|taille|réduction/i.test(text)) return "fr";
  if (/pri|konbyen|gwosè|disponib/i.test(text)) return "ht";
  return "en";
}

function findProduct(message) {
  return products.products.find(p =>
    message.toLowerCase().includes(p.name.toLowerCase())
  );
}

function replyText(lang, product) {
  if (!product) {
    return {
      en: "Sorry, this item is not available.",
      fr: "Désolé, cet article n’est pas disponible.",
      ht: "Dezole, atik sa a pa disponib."
    }[lang];
  }

  const sizeText = product.sizes
    ? ` Sizes: ${product.sizes.join(", ")}`
    : "";

  return {
    en: `${product.name} costs $${product.price} USD.${sizeText}`,
    fr: `${product.name} coûte $${product.price} USD.${sizeText}`,
    ht: `${product.name} koute $${product.price} USD.${sizeText}`
  }[lang];
}

module.exports = { detectLanguage, findProduct, replyText };
