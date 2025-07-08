const express = require('express');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Helper to fetch gold price (USD/gram)
async function getGoldPrice() {
  // Example: Use goldapi.io (replace with your API key)
  // You can use any other gold price API as well
  const apiKey = process.env.GOLD_API_KEY || 'goldapi-demo-APIKEY';
  try {
    const res = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: { 'x-access-token': apiKey, 'Content-Type': 'application/json' }
    });
    // goldapi.io returns price per troy ounce, convert to grams
    const pricePerOunce = res.data.price;
    const pricePerGram = pricePerOunce / 31.1035;
    return pricePerGram;
  } catch (e) {
    console.error('Error fetching gold price:', e.message);
    // fallback to a static value for demo
    return 75; // USD/gram
  }
}

app.get('/api/products', async (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync('./backend/products.json', 'utf-8'));
    const goldPrice = await getGoldPrice();
    const result = products.map(product => {
      const price = ((product.popularityScore + 1) * product.weight * goldPrice).toFixed(2);
      return {
        ...product,
        price: parseFloat(price),
        priceFormatted: `$${price} USD`,
        popularityScore5: (product.popularityScore * 5).toFixed(1)
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load products' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
