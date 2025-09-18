const { chromium } = require('playwright');

async function testExtraction() {
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
    
    // Test the exact extraction logic
    const extractedData = await page.evaluate(() => {
      const results = [];
      const seenTitles = new Set();
      
      const tableRows = document.querySelectorAll('table tbody tr');
      console.log(`Found ${tableRows.length} table rows`);
      
      tableRows.forEach((row, index) => {
        try {
          const cells = row.querySelectorAll('td');
          if (cells.length < 3) return;

          // Extract title from first cell - it's usually in the first part of the text
          const firstCellText = cells[0].textContent.trim();
          console.log(`Row ${index} first cell text:`, firstCellText);
          
          // Extract the main trend title (before search volume info)
          let title = firstCellText.split(/\d+K?\+?\s*searches?/)[0].trim();
          if (!title) {
            // Fallback: try to extract from the beginning of the text
            const match = firstCellText.match(/^([^·]+)/);
            title = match ? match[1].trim() : firstCellText.substring(0, 50).trim();
          }

          console.log(`Row ${index} extracted title:`, title);

          if (!title || title.length < 3 || seenTitles.has(title)) return;

          // Extract search volume from first cell
          const volumeMatch = firstCellText.match(/(\d+K?\+?)\s*searches?/);
          const volume = volumeMatch ? volumeMatch[1] : 'N/A';

          // Extract time info from first cell
          const timeMatch = firstCellText.match(/(\d+h?\s*ago)/);
          const timeAgo = timeMatch ? timeMatch[1] : 'N/A';

          seenTitles.add(title);
          results.push({
            title: title,
            volume: volume,
            timeAgo: timeAgo,
            position: results.length + 1,
            rawText: firstCellText
          });
        } catch (e) {
          console.log('Error processing row:', e.message);
        }
      });
      
      return results;
    });
    
    console.log('Extracted data:', JSON.stringify(extractedData, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

testExtraction();