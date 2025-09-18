const BrowserConfig = require('../utils/browserConfig');
const DelayUtils = require('../utils/delayUtils');
const CategoryFilter = require('../utils/categoryFilter');
require('dotenv').config();

class GoogleTrendsScraper {
  constructor() {
    this.baseUrl = 'https://trends.google.com';
    this.browserConfig = new BrowserConfig();
    this.delayUtils = new DelayUtils();
    this.categoryFilter = new CategoryFilter();
    this.browser = null;
    this.context = null;
  }

  async initialize() {
    this.browser = await this.browserConfig.createBrowser();
    this.context = await this.browserConfig.createStealthContext(this.browser);
  }

  async scrapeRealTimeTrends(geo = 'US', category = '') {
    // Use trending overview as the source for realtime trends since it works correctly
    console.log('🔥 Menggunakan Trending Overview sebagai sumber realtime trends...');
    return await this.scrapeTrendingOverview(geo, 'en-US');
  }

  async scrapeDailyTrends(geo = 'US', date = null) {
    if (!this.context) {
      await this.initialize();
    }

    await this.delayUtils.waitForSlot();
    
    try {
      const page = await this.browserConfig.createPage(this.context);
      console.log('📈 Mengakses Google Trends Daily...');
      
      // Use today's date if not specified
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      // Try multiple URL formats for daily trends
      const dailyUrls = [
        `${this.baseUrl}/trends/trendingsearches/daily?geo=${geo}&date=${targetDate}&hl=en-US`,
        `${this.baseUrl}/trends/trendingsearches/daily?geo=${geo}&date=${targetDate}`,
        `${this.baseUrl}/trends/trendingsearches/daily?geo=${geo}`,
        `${this.baseUrl}/trends/explore?geo=${geo}&date=today`
      ];
      
      let dailySuccessUrl = null;
      for (const url of dailyUrls) {
        try {
          console.log(`🔗 Mencoba daily URL: ${url}`);
          await page.goto(url, { 
            waitUntil: 'networkidle', 
            timeout: 20000 
          });
          dailySuccessUrl = url;
          break;
        } catch (e) {
          console.log(`⚠️ Daily URL gagal: ${url}, mencoba yang lain...`);
        }
      }
      
      if (!dailySuccessUrl) {
        throw new Error('Semua daily URL Google Trends gagal diakses');
      }
      
      await this.delayUtils.smartDelay();
      
      // Use robust fallback scraping approach
      console.log('⚠️ Menggunakan fallback scraping untuk daily trends...');
      
      const trends = await page.evaluate(() => {
        const results = [];
        const textElements = document.querySelectorAll('div, span, p');
        const seenTitles = new Set();
        
        textElements.forEach((element, index) => {
          const text = element.textContent?.trim();
          if (text && text.length > 10 && text.length < 100 && 
              !seenTitles.has(text) && 
              !text.includes('Google') && 
              !text.includes('Trends') &&
              !text.includes('©') &&
              /^[A-Za-z0-9\s\-\.]+$/.test(text)) {
            seenTitles.add(text);
            results.push({
              title: text,
              traffic: 'N/A',
              description: '',
              position: results.length + 1,
              timestamp: new Date().toISOString(),
              source: 'daily-fallback'
            });
          }
        });
        
        return results.slice(0, 10); // Limit to 10 results
      });
        
      await page.close();
      console.log(`✅ Daily fallback scraping mengambil ${trends.length} trends`);
      return trends;
      
    } catch (error) {
      console.error('❌ Error scraping daily trends:', error.message);
      return [];
    } finally {
      this.delayUtils.releaseSlot();
    }
  }

  async scrapeTrendingOverview(geo = 'US', hl = 'en-US') {
    if (!this.context) {
      await this.initialize();
    }

    await this.delayUtils.waitForSlot();

    try {
      const page = await this.browserConfig.createPage(this.context);
      const url = `${this.baseUrl}/trending?geo=${geo}&hl=${hl}`;

      console.log('📰 Mengakses Google Trends overview...');
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      await this.delayUtils.smartDelay();

      // Wait for the trends table to load with robust selectors
      try {
        await Promise.race([
          page.waitForSelector('table[role="grid"] tbody tr', { timeout: 10000 }),
          page.waitForSelector('table tbody tr', { timeout: 10000 }),
          page.waitForSelector('[data-ved]', { timeout: 10000 }),
          page.waitForSelector('[jsname]', { timeout: 10000 })
        ]);
        console.log('✅ Tabel trends ditemukan');
      } catch (e) {
        console.log('⚠️ Tabel trends tidak ditemukan, menggunakan fallback scraping...');
      }

      const stories = await page.evaluate(() => {
        const results = [];
        const seenTitles = new Set();

        // Robust selector strategy for trending overview - avoid CSS classes
        const robustSelectors = [
          // Semantic HTML structure selectors
          'table[role="grid"] tbody tr td span:not(:empty)',
          'table tbody tr td span:not(:empty)',
          'table tr td:first-child span:not(:empty)',
          
          // Data attribute selectors (stable)
          '[data-ved] span:not(:empty)',
          '[data-hveid] span:not(:empty)',
          '[jsname] span:not(:empty)',
          '[jscontroller] span:not(:empty)',
          
          // Role-based selectors
          '[role="listitem"] span:not(:empty)',
          '[role="button"] span:not(:empty)',
          
          // Content-based selectors (fallback)
          'td span:not(:empty)',
          'th span:not(:empty)',
          'button span:not(:empty)',
          'div[data-module-name] span:not(:empty)',
          
          // Generic structure selectors (last resort)
          'table td:first-child',
          'table td:nth-child(2)',
          'div span:not(:empty)'
        ];

        console.log('🔍 Mencoba selector robust untuk trending overview...');

        robustSelectors.forEach((selector, selectorIndex) => {
          if (results.length >= 25) return; // Limit results
          
          const elements = document.querySelectorAll(selector);
          console.log(`Selector ${selectorIndex + 1}: ${selector} - Found ${elements.length} elements`);
          
          elements.forEach((element, elementIndex) => {
            if (results.length >= 25) return;
            
            try {
              let title = '';
              let volume = 'N/A';
              let timeAgo = 'N/A';
              
              // Extract title from element
              if (element.tagName === 'TR') {
                // Handle table row - extract from cells
                const cells = element.querySelectorAll('td, th');
                if (cells.length > 0) {
                  title = cells[0].textContent.trim();
                  if (cells.length > 1) {
                    const secondCellText = cells[1].textContent;
                    const volumeMatch = secondCellText.match(/(\d+[KM]?\+?)\s*searches?/i);
                    if (volumeMatch) volume = volumeMatch[1];
                    
                    const timeMatch = secondCellText.match(/(\d+[hm]?\s*ago)/i);
                    if (timeMatch) timeAgo = timeMatch[1];
                  }
                }
              } else {
                // Handle other elements
                title = element.textContent.trim();
                
                // Try to get additional info from parent row or container
                const row = element.closest('tr');
                if (row) {
                  const cells = row.querySelectorAll('td');
                  if (cells.length > 1) {
                    const cellText = Array.from(cells).map(cell => cell.textContent).join(' ');
                    const volumeMatch = cellText.match(/(\d+[KM]?\+?)\s*searches?/i);
                    if (volumeMatch) volume = volumeMatch[1];
                    
                    const timeMatch = cellText.match(/(\d+[hm]?\s*ago)/i);
                    if (timeMatch) timeAgo = timeMatch[1];
                  }
                }
              }
              
              // Clean and validate title - comprehensive text cleaning
              title = title.replace(/Search termquery_statsExplore/gi, '').trim();
              title = title.replace(/query_statsExplore/gi, '').trim();
              title = title.replace(/query_stats/gi, '').trim();
              title = title.replace(/Explore$/gi, '').trim();
              title = title.replace(/Search term$/gi, '').trim();
              title = title.replace(/^\s*\+\s*/, '').trim(); // Remove leading +
              
              // Remove duplicate words (e.g., "cardi bcardi b" -> "cardi b")
              const words = title.split(/\s+/);
              const uniqueWords = [];
              const seenWords = new Set();
              
              for (const word of words) {
                const cleanWord = word.toLowerCase().trim();
                if (cleanWord && !seenWords.has(cleanWord)) {
                  seenWords.add(cleanWord);
                  uniqueWords.push(word);
                }
              }
              
              title = uniqueWords.join(' ').trim();
              title = title.replace(/\s+/g, ' ').trim(); // Normalize spaces
              
              if (!title || title.length < 2 || seenTitles.has(title)) return;
              
              // Filter out navigation elements and common UI text
              const skipPatterns = [
                /^(home|search|trends|explore|menu|settings|help|about)$/i,
                /^(google|trends|©|\d+$|loading|error)$/i,
                /^(sign in|log in|register|subscribe)$/i
              ];
              
              if (skipPatterns.some(pattern => pattern.test(title))) return;
              
              seenTitles.add(title);
              results.push({
                title: title,
                volume: volume,
                timeAgo: timeAgo,
                source: `selector_${selectorIndex + 1}`,
                elementIndex: elementIndex
              });
              
              console.log(`✅ Found trend: "${title}" (${volume}, ${timeAgo})`);
              
            } catch (error) {
              console.log(`❌ Error processing element ${elementIndex} with selector ${selectorIndex + 1}:`, error.message);
            }
          });
        });

        console.log(`📊 Found ${results.length} trending stories from overview`);
        return results;
      });

      console.log(`✅ Berhasil scraping ${stories.length} trending overview`);
      return stories;

    } catch (error) {
      console.error('❌ Error scraping trending overview:', error.message);
      return [];
    } finally {
      this.delayUtils.releaseSlot();
    }
  }

  async getAllTrends(geo = 'US', options = {}) {
    console.log('🌍 Mengambil semua trending topics...');

    const {
      includeRealtime = true,
      includeDaily = true,
      includeTrendingOverview = true,
      limit = 25
    } = options;
    
    let allTrends = [];
    
    try {
      // Get real-time trends
      if (includeRealtime) {
        const realtimeTrends = await this.scrapeRealTimeTrends(geo);
        allTrends = allTrends.concat(realtimeTrends);
      }
      
      // Get daily trends
      if (includeDaily) {
        const dailyTrends = await this.scrapeDailyTrends(geo);
        allTrends = allTrends.concat(dailyTrends);
      }
      
      // Get trending overview
      if (includeTrendingOverview) {
        console.log('📰 Mengambil trending overview...');
        const overviewTrends = await this.scrapeTrendingOverview(geo, 'en-US');
        allTrends = allTrends.concat(overviewTrends);
      }
      
      // Remove duplicates based on title
      const uniqueTrends = [];
      const seenTitles = new Set();
      
      for (const trend of allTrends) {
        const title = (trend.title || trend.query || '').toLowerCase().trim();
        if (title && !seenTitles.has(title)) {
          seenTitles.add(title);
          uniqueTrends.push(trend);
        }
      }
      
      // Sort by position or timestamp
      const sortedTrends = uniqueTrends
        .sort((a, b) => (a.position || 0) - (b.position || 0))
        .slice(0, limit);
      
      return {
        success: true,
        data: sortedTrends,
        metadata: {
          totalTrends: allTrends.length,
          uniqueTrends: uniqueTrends.length,
          returnedTrends: sortedTrends.length,
          geo,
          timestamp: new Date().toISOString(),
          stats: this.delayUtils.getStats()
        }
      };
      
    } catch (error) {
      console.error('❌ Error getting all trends:', error.message);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Browser ditutup');
    }
  }

  getStats() {
    return {
      delayStats: this.delayUtils.getStats(),
      categories: this.categoryFilter.getAllCategories()
    };
  }
}

module.exports = GoogleTrendsScraper;
