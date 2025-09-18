const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const GoogleTrendsScraper = require('./scrapers/googleTrendsScraper');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Global scraper instance
let scraper = null;

// Initialize scraper
async function initializeScraper() {
  if (!scraper) {
    scraper = new GoogleTrendsScraper();
    await scraper.initialize();
    console.log('✅ Scraper initialized');
  }
  return scraper;
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get all trends (not just tech)
app.get('/api/trends', async (req, res) => {
  try {
    const {
      geo = 'US',
      includeRealtime = 'true',
      includeDaily = 'true',
      includeTrendingOverview = 'true',
      includeKeywordAnalysis = 'false',
      limit = '25',
      techOnly = 'false',
      includeNewsLinks = 'false'
    } = req.query;
    
    console.log(`🔍 API Request - Region: ${geo}, Limit: ${limit}, Tech Only: ${techOnly}, News Links: ${includeNewsLinks}`);
    
    const scraperInstance = await initializeScraper();
    
    const options = {
      includeRealtime: includeRealtime === 'true',
      includeDaily: includeDaily === 'true',
      includeTrendingOverview: includeTrendingOverview === 'true',
      includeKeywordAnalysis: includeKeywordAnalysis === 'true',
      limit: parseInt(limit)
    };
    
    let result;
    if (techOnly === 'true') {
      // Use existing tech trends method
      result = await scraperInstance.getTechTrends(geo, options);
    } else {
      // Get all trends without tech filtering
      result = await scraperInstance.getAllTrends(geo, options);
    }
    
    // Add news links if requested
    if (includeNewsLinks === 'true' && result.data) {
      console.log('📰 Menambahkan link berita untuk trending topics...');
      const trendsWithNews = await Promise.all(
        result.data.slice(0, Math.min(5, result.data.length)).map(async (trend, index) => {
          try {
            console.log(`📰 Mengambil berita untuk: ${trend.title} (${index + 1}/${Math.min(5, result.data.length)})`);
            const newsData = await scraperInstance.scrapeNewsLinksForTrend(trend.title, geo);
            return {
              ...trend,
              newsLinks: newsData.newsLinks || []
            };
          } catch (error) {
            console.error(`❌ Error getting news for ${trend.title}:`, error.message);
            return {
              ...trend,
              newsLinks: []
            };
          }
        })
      );
      
      // Update result with news-enhanced trends
      result.data = trendsWithNews.concat(result.data.slice(Math.min(5, result.data.length)));
    }

    // Log trending topics list to console
    if (result.data && result.data.length > 0) {
      console.log('\n📊 DAFTAR TRENDING TOPICS:');
      console.log('=' .repeat(50));
      result.data.forEach((trend, index) => {
        const title = trend.title || trend.query || 'Unknown';
        const volume = trend.volume || trend.traffic || 'N/A';
        const timeAgo = trend.timeAgo || 'N/A';
        const source = trend.source || 'unknown';
        
        console.log(`${index + 1}. ${title}`);
        console.log(`   📈 Volume: ${volume}`);
        console.log(`   ⏰ Time: ${timeAgo}`);
        console.log(`   📍 Source: ${source}`);
        console.log('');
      });
      console.log(`✅ Total: ${result.data.length} trending topics untuk region ${geo}`);
      console.log('=' .repeat(50));
    }
    
    res.json({
      success: true,
      data: result.data || result,
      metadata: {
        ...result.metadata,
        totalTrends: result.metadata?.totalTrends || (result.data || result).length || 0,
        returnedTrends: (result.data || result).length || 0,
        includeNewsLinks: includeNewsLinks === 'true',
        newsLinksCount: includeNewsLinks === 'true' ? Math.min(5, (result.data || result).length) : 0,
        geo: geo,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ API Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint to get specific keyword trend
app.get('/api/keyword/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const { geo = 'US', timeRange = 'today 12-m' } = req.query;
    
    console.log(`🔍 Keyword Analysis Request: ${keyword}`);
    
    const scraperInstance = await initializeScraper();
    const result = await scraperInstance.scrapeKeywordTrend(keyword, geo, timeRange);
    
    if (result) {
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Keyword trend not found',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('❌ Keyword API Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint to save trending topics to JSON file
app.post('/api/save-trends', async (req, res) => {
  try {
    const { 
      geo = 'US', 
      limit = 25, 
      techOnly = 'false',
      includeRealtime = 'true',
      includeDaily = 'true',
      includeTrendingOverview = 'true',
      includeKeywordAnalysis = 'false',
      includeNewsLinks = 'false',
      filename
    } = req.body;
    
    console.log(`💾 Save Request - Region: ${geo}, Limit: ${limit}, Tech Only: ${techOnly}, News Links: ${includeNewsLinks}`);
    
    const scraperInstance = await initializeScraper();
    
    const options = {
      includeRealtime: includeRealtime === 'true',
      includeDaily: includeDaily === 'true',
      includeTrendingOverview: includeTrendingOverview === 'true',
      includeKeywordAnalysis: includeKeywordAnalysis === 'true',
      limit: parseInt(limit)
    };
    
    let result;
    if (techOnly === 'true') {
      result = await scraperInstance.getTechTrends(geo, options);
    } else {
      result = await scraperInstance.getAllTrends(geo, options);
    }
    
    // Add news links if requested
    if (includeNewsLinks === 'true' && result.data) {
      console.log('📰 Menambahkan link berita untuk save...');
      const trendsWithNews = await Promise.all(
        result.data.slice(0, Math.min(5, result.data.length)).map(async (trend, index) => {
          try {
            console.log(`📰 Mengambil berita untuk: ${trend.title} (${index + 1}/${Math.min(5, result.data.length)})`);
            const newsData = await scraperInstance.scrapeNewsLinksForTrend(trend.title, geo);
            return {
              ...trend,
              newsLinks: newsData.newsLinks || []
            };
          } catch (error) {
            console.error(`❌ Error getting news for ${trend.title}:`, error.message);
            return {
              ...trend,
              newsLinks: []
            };
          }
        })
      );
      
      result.data = trendsWithNews.concat(result.data.slice(Math.min(5, result.data.length)));
    }
    
    // Prepare data to save
    const saveData = {
      success: true,
      data: result.data || result,
      metadata: {
        ...result.metadata,
        totalTrends: result.metadata?.totalTrends || (result.data || result).length || 0,
        returnedTrends: (result.data || result).length || 0,
        includeNewsLinks: includeNewsLinks === 'true',
        newsLinksCount: includeNewsLinks === 'true' ? Math.min(5, (result.data || result).length) : 0,
        geo: geo,
        savedAt: new Date().toISOString(),
        parameters: {
          geo,
          limit: parseInt(limit),
          techOnly: techOnly === 'true',
          includeRealtime: includeRealtime === 'true',
          includeDaily: includeDaily === 'true',
          includeTrendingOverview: includeTrendingOverview === 'true',
          includeKeywordAnalysis: includeKeywordAnalysis === 'true',
          includeNewsLinks: includeNewsLinks === 'true'
        }
      },
      timestamp: new Date().toISOString()
    };
    
    // Generate filename if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalFilename = filename || `trending-topics-${geo}-${timestamp}.json`;
    const filePath = path.join(__dirname, '..', 'saved-trends', finalFilename);
    
    // Create directory if it doesn't exist
    const saveDir = path.dirname(filePath);
    try {
      await fs.mkdir(saveDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    // Save to file
    await fs.writeFile(filePath, JSON.stringify(saveData, null, 2), 'utf8');
    
    console.log(`✅ Trending topics saved to: ${filePath}`);
    
    res.json({
      success: true,
      message: 'Trending topics saved successfully',
      filename: finalFilename,
      filePath: filePath,
      dataCount: (result.data || result).length,
      metadata: saveData.metadata,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Save Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint to get scraper stats
app.get('/api/stats', async (req, res) => {
  try {
    if (scraper) {
      const stats = scraper.getStats();
      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({
        success: true,
        data: { message: 'Scraper not initialized yet' },
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint to get available categories
app.get('/api/categories', (req, res) => {
  try {
    const CategoryFilter = require('./utils/categoryFilter');
    const filter = new CategoryFilter();
    const categories = filter.getAllCategories();
    
    res.json({
      success: true,
      data: categories,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  if (scraper) {
    await scraper.close();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  if (scraper) {
    await scraper.close();
  }
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Google Trends Scraper Server');
  console.log('=' .repeat(40));
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET /api/trends - Get tech trends`);
  console.log(`   GET /api/keyword/:keyword - Analyze specific keyword`);
  console.log(`   GET /api/stats - Get scraper statistics`);
  console.log(`   GET /api/categories - Get available categories`);
  console.log(`   GET /health - Health check`);
  console.log('=' .repeat(40));
});

module.exports = app;