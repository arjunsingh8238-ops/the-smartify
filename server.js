const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Tell express to serve files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
