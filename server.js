const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Serve static files from the public folder (Frontend PWA)
app.use(express.static(path.join(__dirname, 'public')));

// Server status route
app.get('/api/status', (req, res) => {
    res.send({ status: "The Smartify Backend is Active & Running!" });
});

// Shopify Product Creation Webhook Endpoint
app.post('/webhook/products/create', async (req, res) => {
    try {
        const product = req.body;
        console.log("New Product Received from Shopify:", product.title);

        const productTitle = product.title;
        const productImage = product.images && product.images.length > 0 ? product.images[0].src : '';
        const productPrice = product.variants && product.variants.length > 0 ? product.variants[0].price : '';

        console.log(`Sharing product: ${productTitle} - Price: ${productPrice} - Image: ${productImage}`);

        res.status(200).send('Webhook received successfully');
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
