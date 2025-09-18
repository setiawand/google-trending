const { chromium } = require('playwright');

async function debugTrends() {
  const browser = await chromium.launch({ 
    headless: false
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to Google Trends...');
    await page.goto('https://trends.google.com/trending?geo=US&hl=en-US', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await page.waitForTimeout(5000);
    
    console.log('Page title:', await page.title());
    
    // Check for table rows
    const tableRows = await page.locator('tbody tr').count();
    console.log(`Found ${tableRows} table rows`);
    
    // Get table data
    const tableData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      return rows.map((row, index) => {
        const cells = Array.from(row.querySelectorAll('td'));
        return {
          index,
          cellCount: cells.length,
          text: cells.map(cell => cell.textContent?.trim()).filter(text => text),
          html: row.innerHTML.substring(0, 200) + '...'
        };
      });
    });
    
    console.log('Table data sample:');
    tableData.slice(0, 5).forEach(row => {
      console.log(`Row ${row.index}: ${row.cellCount} cells`);
      console.log(`Text: ${JSON.stringify(row.text)}`);
      console.log(`HTML: ${row.html}`);
      console.log('---');
    });
    
    // Look for specific trending keywords from the image
    const trendingKeywords = ['cardi b', 'robert irwin', 'luigi mangione', 'real madrid', 'dancing with the stars'];
    
    for (const keyword of trendingKeywords) {
      const found = await page.locator(`text=${keyword}`).count();
      console.log(`"${keyword}": ${found} matches found`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugTrends();
