const express = require('express');
const path = require('path');
const fs = require('fs');
const { execFile } = require("child_process");
const { getJson } = require("serpapi");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.SERPAPI_API_KEY;
// const DOWNLOAD_DIR = path.join(__dirname__, "downloads");
const DOWNLOAD_DIR = path.join(__dirname, "downloads");

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/downloads", express.static(DOWNLOAD_DIR));

app.get("/api/search", (req, res) => {
    const { q, count = 5} = req.query;

    if (!q) {
        return res.status(400).json({ error: "Query parameter 'q' is required."});
    }

    getJson({
        engine: "google_short_videos",
        q,
        api_key: API_KEY,
    }).then((json) => {
        const videos = (json.short_videos_results || []).slice(0, parseInt(count));
        res.json({videos});
    }).catch((error) => {
        console.error("Error fetching search results: ", error);
        res.status(500).json({ error: "Failed to fetch search resutls."});
    })
})
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})