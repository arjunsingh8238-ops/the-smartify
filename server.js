const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/', (req, res) => {
  res.send('The Smartify App Backend is running successfully!');
});

// Shopify Product Created Webhook (Clean & Simple)
app.post('/api/webhook/shopify-product-created', async (req, res) => {
  try {
    const product = req.body;
    console.log('New product received from Shopify:', product.title);

    res.status(200).json({ success: true, message: 'Webhook received successfully without errors!' });
  } catch (error) {
    console.error('Webhook Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
