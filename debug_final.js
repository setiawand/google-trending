const { chromium } = require('playwright');

async function debugFinal() {
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
    
    await page.waitForTimeout(8000); // Wait longer for content to load
    
    // Get the full HTML structure
    const htmlContent = await page.content();
    
    // Look for the actual trending data in various ways
    const analysis = await page.evaluate(() => {
      const results = {
        tableInfo: {},
        textContent: [],
        possibleSelectors: []
      };
      
      // Check table structure
      const tables = document.querySelectorAll('table');
      results.tableInfo.count = tables.length;
      
      if (tables.length > 0) {
        const mainTable = tables[0];
        const rows = mainTable.querySelectorAll('tr');
        results.tableInfo.rows = rows.length;
        
        // Get sample row content
        if (rows.length > 1) {
          const sampleRow = rows[1]; // Skip header
          const cells = sampleRow.querySelectorAll('td, th');
          results.tableInfo.sampleRowCells = cells.length;
          results.tableInfo.sampleRowHTML = sampleRow.innerHTML.substring(0, 500);
          
          // Try to extract text from each cell
          results.tableInfo.cellTexts = Array.from(cells).map(cell => 
            cell.textContent.trim().substring(0, 100)
          );
        }
      }
      
      // Look for trending keywords in page text
      const trendingKeywords = ['cardi b', 'robert irwin', 'luigi mangione', 'real madrid', 'dancing with the stars'];
      const pageText = document.body.textContent.toLowerCase();
      
      trendingKeywords.forEach(keyword => {
        if (pageText.includes(keyword)) {
          // Find elements containing this keyword
          const elements = Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent.toLowerCase().includes(keyword) && 
            el.children.length === 0 // leaf nodes only
          );
          
          elements.forEach(el => {
            results.possibleSelectors.push({
              keyword: keyword,
              tagName: el.tagName,
              className: el.className,
              textContent: el.textContent.trim().substring(0, 100),
              parentTagName: el.parentElement?.tagName,
              parentClassName: el.parentElement?.className
            });
          });
        }
      });
      
      return results;
    });
    
    console.log('Analysis results:', JSON.stringify(analysis, null, 2));
    
    // Take a screenshot for visual inspection
    await page.screenshot({ path: 'trends_final_debug.png', fullPage: true });
    console.log('Screenshot saved as trends_final_debug.png');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugFinal();