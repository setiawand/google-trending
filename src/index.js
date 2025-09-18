const GoogleTrendsScraper = require('./scrapers/googleTrendsScraper');
require('dotenv').config();

async function main() {
  const scraper = new GoogleTrendsScraper();
  
  try {
    console.log('🚀 Memulai Google Trends Scraper untuk Teknologi Niche');
    console.log('=' .repeat(60));
    
    // Initialize scraper
    await scraper.initialize();
    
    // Get tech trends with options
    const options = {
      includeRealtime: true,
      includeDaily: true,
      includeKeywordAnalysis: false, // Set to true for detailed analysis
      limit: 15
    };

    const region = process.env.REGION || 'US';
    const locale = process.env.HL || 'en-US';
    console.log(`🌍 Mengambil trends untuk region: ${region}`);

    if (process.argv.includes('--overview')) {
      console.log('\n📰 MODE OVERVIEW AKTIF');
      const overviewStories = await scraper.scrapeTrendingOverview(region, locale);
      if (overviewStories.length === 0) {
        console.log('⚠️ Tidak ada data overview yang berhasil diambil.');
      } else {
        console.log(`✅ Ditemukan ${overviewStories.length} stories dari halaman overview`);
        overviewStories.slice(0, 10).forEach((story, index) => {
          console.log(`\n[Overview #${index + 1}] ${story.title}`);
          if (story.traffic) {
            console.log(`   📈 Traffic: ${story.traffic}`);
          }
          if (story.snippet) {
            console.log(`   📝 Snippet: ${story.snippet}`);
          }
          if (story.shareUrl) {
            console.log(`   🔗 URL: ${story.shareUrl}`);
          }
          if (story.categories && story.categories.length > 0) {
            console.log(`   🏷️  Kategori: ${story.categories.join(', ')}`);
          }
        });
      }
    }

    const result = await scraper.getTechTrends(region, options);
    
    if (result.success) {
      console.log('\n📊 HASIL SCRAPING GOOGLE TRENDS - TEKNOLOGI NICHE');
      console.log('=' .repeat(60));
      
      result.data.forEach((trend, index) => {
        console.log(`\n${index + 1}. ${trend.title}`);
        console.log(`   📈 Traffic: ${trend.traffic || 'N/A'}`);
        console.log(`   🏷️  Kategori: ${trend.categories.join(', ')}`);
        console.log(`   ⭐ Skor Relevansi: ${trend.relevanceScore}`);
        console.log(`   📍 Sumber: ${trend.source}`);
        
        if (trend.description) {
          console.log(`   📝 Deskripsi: ${trend.description.substring(0, 100)}...`);
        }
        
        if (trend.relatedTopics && trend.relatedTopics.length > 0) {
          console.log(`   🔗 Topik Terkait: ${trend.relatedTopics.slice(0, 3).join(', ')}`);
        }
        
        if (trend.detailedAnalysis) {
          console.log(`   🔍 Query Terkait: ${trend.detailedAnalysis.relatedQueries.slice(0, 3).map(q => q.query).join(', ')}`);
        }
      });
      
      console.log('\n📈 STATISTIK SCRAPING');
      console.log('=' .repeat(30));
      console.log(`Total trends ditemukan: ${result.metadata.totalTrends}`);
      console.log(`Trends teknologi: ${result.metadata.techTrends}`);
      console.log(`Top trends niche: ${result.metadata.topTrends}`);
      console.log(`Region: ${result.metadata.geo}`);
      console.log(`Waktu scraping: ${new Date(result.metadata.timestamp).toLocaleString('id-ID')}`);
      
      const stats = scraper.getStats();
      console.log(`\nTotal requests: ${stats.delayStats.totalRequests}`);
      console.log(`Active requests: ${stats.delayStats.activeRequests}`);
      console.log(`Kategori tersedia: ${stats.categories.join(', ')}`);
      
    } else {
      console.error('❌ Scraping gagal:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error dalam main function:', error.message);
    console.error(error.stack);
  } finally {
    await scraper.close();
    console.log('\n✅ Scraping selesai!');
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Menerima signal SIGINT, menutup aplikasi...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Menerima signal SIGTERM, menutup aplikasi...');
  process.exit(0);
});

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { main, GoogleTrendsScraper };
