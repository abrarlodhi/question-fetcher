const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Server is running ✅");
});

app.get("/fetch", async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await axios.get(url);
        const ids = response.data.match(/Question ID\s*:\s*\d+/g);
        res.json({ extractedIDs: ids });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch content" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});