const cheerio = require("cheerio");

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

                // Get Question ID (next bold cell)
                const questionID = $(el).next("td.bold").text().trim();

                // Find Chosen Option label in same table
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

        res.json({ total: results.length, data: results });

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch content" });
    }
});
