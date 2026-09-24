const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Shopify Sync Route
app.get('/api/authshopify', (req, res) => {
  res.json({ success: true, message: "Shopify sync initiated successfully!" });
});

// Social Channels Connect Route
app.post('/api/connect/channel', (req, res) => {
  const { channel } = req.body;
  res.json({ success: true, message: `${channel} connection flow started.` });
});

// *************************************
// SHOPIFY TO FACEBOOK AUTOMATION WEBHOOK
// *************************************
app.post('/api/webhook/shopify-product-created', async (req, res) => {
  try {
    const product = req.body;
    
    const productTitle = product.title || 'Check out this new product!';
    const productImage = product.images && product.images.length > 0 ? product.images[0].src : '';
    const shopDomain = process.env.SHOPIFY_SHOP || 'the-smartify.myshopify.com';
    const productUrl = `https://${shopDomain}/products/${product.handle}`;

    console.log(`New Product Received from Shopify: ${productTitle}`);
    console.log(`Image URL: ${productImage}`);

    const pageId = process.env.PAGE_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (!accessToken) {
      console.log('Facebook Access Token is missing. Webhook received successfully, but posting skipped.');
      return res.status(200).json({ success: true, message: 'Webhook received, but FB Token is missing.' });
    }

    const message = `${productTitle}\n\nShop now: ${productUrl}`;

    // Posting to Facebook Page Graph API
    if (productImage) {
      await axios.post(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
        url: productImage,
        caption: message,
        access_token: accessToken
      });
    } else {
      await axios.post(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
        message: message,
        access_token: accessToken
      });
    }

    console.log('Product auto-shared to Facebook successfully!');
    res.status(200).json({ success: true, message: 'Product auto-shared to Facebook successfully!' });
  } catch (error) {
    console.error('Webhook Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
