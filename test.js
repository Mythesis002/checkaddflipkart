const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 10000;

async function resolveFlipkartUrl(shortenedUrl) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Navigate to the shortened URL
    await page.goto(shortenedUrl, { waitUntil: 'networkidle2' });

    // Extract the final URL after all redirects
    const finalUrl = page.url();

    await browser.close();

    return finalUrl;
}

function extractBrandName(url) {
    const regex = /https:\/\/www\.flipkart\.com\/([^\/]+)/;
    const match = url.match(regex);
    if (match) {
        const brandPart = match[1].split('-')[0];  // Split by '-' and take the first part
        console.log(brandPart);
        return brandPart;
    }
    return null;
}

app.get('/resolveShortenedUrl', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        const finalUrl = await resolveFlipkartUrl(url);
        const brandName = extractBrandName(finalUrl);
        console.log(brandName)
        res.json({ finalUrl, brandName });
    } catch (error) {
        console.error('Error resolving URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
