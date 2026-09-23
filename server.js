const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SHOPIFY_SHOP = process.env.SHOPIFY_SHOP || 'bucbhq-e5.myshopify.com';
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;

// API Route to fetch products from Shopify
app.get('/api/products', async (req, res) => {
    try {
        if (!SHOPIFY_API_KEY || !SHOPIFY_API_SECRET) {
            return res.status(400).json({ error: 'Shopify API credentials not configured in environment variables.' });
        }

        // Using Shopify Admin REST API
        const url = `https://${SHOPIFY_SHOP}/admin/api/2024-07/products.json?limit=250`;
        const response = await axios.get(url, {
            headers: {
                'X-Shopify-Access-Token': SHOPIFY_API_SECRET
            }
        });

        res.json({
            success: true,
            count: response.data.products.length,
            products: response.data.products
        });
    } catch (error) {
        console.error('Error fetching products:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: error.response?.data?.errors || error.message 
        });
    }
});

// Meta Posting Simulation / Endpoint placeholder
app.post('/api/post-social', async (req, res) => {
    const { productId, platform } = req.body;
    // Here you can integrate Facebook/Instagram Graph API posting logic
    res.json({ 
        success: true, 
        message: `Successfully triggered automated post for Product ID ${productId} to ${platform || 'Facebook & Instagram'}!` 
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
