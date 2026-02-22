const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");

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
        const $ = cheerio.load(response.data);

        let results = [];

        $("td").each((i, el) => {
            const label = $(el).text().trim();

            if (label === "Question ID :") {
                const questionID = $(el).next("td.bold").text().trim();

                const chosenLabel = $(el)
                    .parent()
                    .nextAll()
                    .find("td:contains('Chosen Option :')")
                    .first();

                let chosenOption = "";

                if (chosenLabel.length) {
                    chosenOption = chosenLabel.next("td.bold").text().trim();
                }

                results.push({
                    questionID,
                    chosenOption
                });
            }
        });

        res.json({
            total: results.length,
            data: results
        });

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch content" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
