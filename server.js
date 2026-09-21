const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');
const axios = require('axios'); // Facebook Graph API ke liye

const PORT = process.env.PORT || 10000;

// Shopify webhooks raw body maangte hain verification ke liye,
// lekin abhi ke liye hum JSON parser use kar rahe hain
app.use(bodyParser.json());

// Serve frontend static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Shopify Product Create Webhook Endpoint
app.post('/webhook/products/create', async (req, res) => {
  try {
    const product = req.body;
    console.log('New Product Received from Shopify:', product.title);

    // Product ki details nikalna
    const title = product.title;
    const variants = product.variants || [];
    const price = variants.length > 0 ? variants[0].price : 'N/A';
    const images = product.images || [];
    const imageUrl = images.length > 0 ? images[0].src : '';

    // Product ka link (agar store URL pata ho)
    const productHandle = product.handle || '';
    const productUrl = productHandle ? `https://the-smartify.myshopify.com/products/${productHandle}` : '';

    // Facebook Page par share karne ke liye message
    const message = `🔥 New Arrival: ${title}\n💰 Price: $${price}\n👉 Buy now: ${productUrl}`;

    // Facebook Page Auto-Sharing Logic (Yahan aapko apna Page Access token aur Page ID dalna hoga)
    const PAGE_ACCESS_TOKEN = process.env.PR_PAGE_ACCESS_TOKEN;
    const PAGE_ID = process.env.PR_PAGE_ID;

    if (PAGE_ACCESS_TOKEN && PAGE_ID) {
      const fbUrl = `https://graph.facebook.com/v18.0/${PAGE_ID}/feed`;
      await axios.post(fbUrl, {
        message: message,
        link: productUrl,
        access_token: PAGE_ACCESS_TOKEN
      });
      console.log('Product successfully shared to Facebook Page!');
    } else {
      console.log('Facebook credentials not configured yet, skipping social share.');
    }

    res.status(200).send('Webhook received successfully!');
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    res.status(500).send('Internal Server Error!');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
