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

// Social Channels Connect Route (Facebook, Instagram, etc.)
app.post('/api/connect/channel', (req, res) => {
    const { channel } = req.body;
    res.json({ success: true, message: `${channel} connection flow started.` });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
