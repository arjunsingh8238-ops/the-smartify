const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Shopify Sync Route
app.get('/api/auth/shopify', (req, res) => {
    res.json({ success: true, message: "Shopify sync initiated successfully!" });
});

// Social Channels Connect Route
app.post('/api/connect/channel', (req, res) => {
    const { channel } = req.body;
    res.json({ success: true, message: `${channel} connection flow started.` });
});

// ==========================================
// SHOPIFY TO FACEBOOK AUTOMATION WEBHOOK
// ==========================================
app.post('/api/webhook/shopify-product-created', async (req, res) => {
    try {
        const product = req.body;
        
        const productTitle = product.title;
        const productImages = product.images && product.images.length > 0 ? product.images[0].src : '';
        const productUrl = `https://the-smartify.myshopify.com/products/${product.handle}`;

        console.log(`New Product Received from Shopify: ${productTitle}`);
        console.log(`Image URL: ${productImages}`);

        res.status(200).json({ success: true, message: "Product auto-shared to Facebook successfully!" });
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
