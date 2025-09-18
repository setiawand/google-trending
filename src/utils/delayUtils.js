const delay = require('delay');

class DelayUtils {
  constructor() {
    this.requestCount = 0;
    this.lastRequestTime = 0;
    this.maxConcurrentRequests = parseInt(process.env.MAX_CONCURRENT_REQUESTS) || 2;
    this.activeRequests = 0;
  }

  async randomDelay(min = 2000, max = 5000) {
    const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`⏳ Menunggu ${delayTime}ms untuk menghindari deteksi...`);
    await delay(delayTime);
  }

  async humanLikeDelay() {
    // Simulasi perilaku manusia dengan delay yang bervariasi
    const patterns = [
      { min: 1500, max: 3000 }, // Cepat
      { min: 3000, max: 6000 }, // Normal
      { min: 6000, max: 10000 }, // Lambat
      { min: 10000, max: 15000 } // Sangat lambat (jarang)
    ];
    
    const weights = [0.3, 0.5, 0.15, 0.05]; // Probabilitas untuk setiap pola
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedPattern = patterns[0];
    
    for (let i = 0; i < patterns.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        selectedPattern = patterns[i];
        break;
      }
    }
    
    await this.randomDelay(selectedPattern.min, selectedPattern.max);
  }

  async rateLimitDelay() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 1000; // Minimum 1 detik antara request
    
    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await delay(waitTime);
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  async waitForSlot() {
    while (this.activeRequests >= this.maxConcurrentRequests) {
      await delay(100);
    }
    this.activeRequests++;
  }

  releaseSlot() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
  }

  async smartDelay() {
    // Kombinasi rate limiting dan human-like delay
    await this.rateLimitDelay();
    
    // Tambahan delay berdasarkan jumlah request
    if (this.requestCount % 10 === 0) {
      console.log('🛑 Istirahat panjang setelah 10 request...');
      await this.randomDelay(15000, 30000);
    } else if (this.requestCount % 5 === 0) {
      console.log('⏸️ Istirahat sedang setelah 5 request...');
      await this.randomDelay(8000, 15000);
    } else {
      await this.humanLikeDelay();
    }
  }

  getStats() {
    return {
      totalRequests: this.requestCount,
      activeRequests: this.activeRequests,
      maxConcurrent: this.maxConcurrentRequests,
      lastRequestTime: new Date(this.lastRequestTime).toISOString()
    };
  }

  reset() {
    this.requestCount = 0;
    this.lastRequestTime = 0;
    this.activeRequests = 0;
    console.log('🔄 Statistik delay direset');
  }
}

module.exports = DelayUtils;