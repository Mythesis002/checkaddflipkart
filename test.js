const puppeteer = require('puppeteer');

async function resolveFlipkartUrl(shortenedUrl) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navigate to the shortened URL
    await page.goto(shortenedUrl);
    
    // Extract the final URL after all redirects
    const finalUrl = page.url();
    
    await browser.close();
    
    return finalUrl;
}

// Example usage
const shortenedUrl = 'https://dl.flipkart.com/s/aRC8FluuuN';
resolveFlipkartUrl(shortenedUrl)
    .then(finalUrl => {
        console.log('Resolved URL:', finalUrl);
    })
    .catch(error => {
        console.error('Error resolving URL:', error);
    });
