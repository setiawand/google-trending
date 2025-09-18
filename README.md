# Google Trends Scraper - Teknologi Niche

🚀 **Aplikasi web scraping Google Trends yang fokus pada kategori teknologi niche dengan anti-detection menggunakan Playwright**

## ✨ Fitur Utama

- 🤖 **Anti-Detection**: Menggunakan stealth mode dengan Playwright untuk menghindari deteksi bot
- 🎯 **Fokus Teknologi Niche**: Filter otomatis untuk tren teknologi yang sedang berkembang
- ⚡ **Rate Limiting**: Sistem delay cerdas untuk menghindari pemblokiran
- 🌐 **Web Interface**: Dashboard modern dan responsif
- 📊 **Multiple Sources**: Mengambil data dari real-time dan daily trends
- 🔍 **Keyword Analysis**: Analisis mendalam untuk keyword tertentu
- 📈 **Scoring System**: Sistem penilaian relevansi untuk tren niche

## 🛠️ Teknologi yang Digunakan

- **Node.js** - Runtime JavaScript
- **Playwright** - Browser automation dengan stealth mode
- **Express.js** - Web server dan API
- **HTML/CSS/JavaScript** - Frontend interface
- **dotenv** - Environment configuration

## 📦 Instalasi

1. **Clone atau download proyek ini**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npm run install-browsers
   ```

4. **Konfigurasi environment (opsional):**
   ```bash
   cp .env.example .env
   # Edit .env sesuai kebutuhan
   ```

## 🚀 Cara Penggunaan

### Mode Command Line
```bash
# Jalankan scraper sekali
npm start

# Jalankan dengan auto-reload (development)
npm run dev

# Jalankan scraper khusus halaman overview trending
npm start -- --overview
```

### Mode Web Server
```bash
# Jalankan web server
npm run server
```

Kemudian buka browser dan akses: `http://localhost:3000`

## 🔧 Konfigurasi

Edit file `.env` untuk menyesuaikan pengaturan:

```env
# Server Configuration
PORT=3000

# Scraping Configuration
SCRAPE_DELAY_MIN=2000
SCRAPE_DELAY_MAX=5000
MAX_CONCURRENT_REQUESTS=2

# Google Trends Configuration
TREND_CATEGORIES=technology,programming,ai,blockchain,cybersecurity,cloud,iot,machine-learning
REGION=US
TIME_RANGE=today 12-m
HL=en-US

# Anti-Detection Settings
USE_STEALTH_MODE=true
ROTATE_USER_AGENTS=true
USE_PROXY=false

# Debug
DEBUG_MODE=false
```

## 📊 API Endpoints

### GET `/api/trends`
Mengambil tren teknologi niche

**Query Parameters:**
- `geo` - Region code (default: US)
- `limit` - Jumlah hasil (default: 15)
- `includeRealtime` - Include real-time trends (default: true)
- `includeDaily` - Include daily trends (default: true)
- `includeKeywordAnalysis` - Include detailed analysis (default: false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "React 18",
      "traffic": "50K+ searches",
      "categories": ["programming", "niche"],
      "relevanceScore": 15,
      "position": 1,
      "source": "realtime",
      "relatedTopics": ["Next.js", "TypeScript"]
    }
  ],
  "metadata": {
    "totalTrends": 25,
    "techTrends": 12,
    "topTrends": 10,
    "geo": "US",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET `/api/keyword/:keyword`
Analisis mendalam untuk keyword tertentu

**Query Parameters:**
- `geo` - Region code (default: US)
- `timeRange` - Time range (default: today 12-m)

### GET `/api/stats`
Statistik scraper

### GET `/api/categories`
Daftar kategori yang tersedia

### GET `/health`
Health check endpoint

## 🎯 Kategori Teknologi Niche

Aplikasi ini secara otomatis memfilter dan mengkategorikan tren berdasarkan:

### Programming & Development
- JavaScript, Python, React, Node.js, TypeScript
- Docker, Kubernetes, Microservices, API, GraphQL
- Git, GitHub, DevOps, CI/CD

### AI & Machine Learning
- Artificial Intelligence, Machine Learning, Deep Learning
- TensorFlow, PyTorch, OpenAI, ChatGPT, LLM
- Computer Vision, NLP, Transformer models

### Blockchain & Crypto
- Blockchain, Cryptocurrency, Bitcoin, Ethereum
- NFT, DeFi, Smart Contracts, Web3, DAO

### Cloud & Infrastructure
- AWS, Azure, Google Cloud, Serverless
- Cloud Computing, SaaS, PaaS, Edge Computing

### Cybersecurity
- Cybersecurity, InfoSec, Penetration Testing
- Vulnerability, Malware, Encryption, VPN

### IoT & Hardware
- Internet of Things, Raspberry Pi, Arduino
- Embedded Systems, Smart Home, Wearables

### Emerging Technologies
- Quantum Computing, AR/VR, 5G/6G
- Edge AI, Neuromorphic Computing

## 🛡️ Anti-Detection Features

1. **Stealth Mode**: Menggunakan konfigurasi browser yang menyerupai pengguna asli
2. **User Agent Rotation**: Rotasi user agent secara otomatis
3. **Human-like Delays**: Delay yang menyerupai perilaku manusia
4. **Rate Limiting**: Pembatasan request untuk menghindari spam detection
5. **Resource Blocking**: Memblokir resource yang tidak perlu untuk mempercepat loading
6. **Headers Manipulation**: Mengatur headers HTTP yang realistis

## 📁 Struktur Proyek

```
google-trending/
├── src/
│   ├── scrapers/
│   │   └── googleTrendsScraper.js    # Main scraper class
│   ├── utils/
│   │   ├── browserConfig.js          # Browser stealth configuration
│   │   ├── delayUtils.js            # Rate limiting and delays
│   │   └── categoryFilter.js        # Tech category filtering
│   ├── public/
│   │   └── index.html               # Web interface
│   ├── index.js                     # CLI application
│   └── server.js                    # Web server
├── package.json
├── .env                             # Environment configuration
├── .gitignore
└── README.md
```

## 🔍 Contoh Output

```
📊 HASIL SCRAPING GOOGLE TRENDS - TEKNOLOGI NICHE
============================================================

1. Svelte 5
   📈 Traffic: 25K+ searches
   🏷️  Kategori: programming, niche
   ⭐ Skor Relevansi: 15
   📍 Sumber: realtime
   🔗 Topik Terkait: SvelteKit, Vite, React

2. Rust Programming
   📈 Traffic: 18K+ searches
   🏷️  Kategori: programming, niche
   ⭐ Skor Relevansi: 13
   📍 Sumber: daily
   🔗 Topik Terkait: WebAssembly, Systems Programming

📈 STATISTIK SCRAPING
==============================
Total trends ditemukan: 28
Trends teknologi: 15
Top trends niche: 12
Region: US
Waktu scraping: 15/01/2024 17:30:00

Total requests: 3
Active requests: 0
Kategori tersedia: programming, ai, blockchain, cloud, cybersecurity, iot, emerging, data, niche
```

## ⚠️ Penting untuk Diperhatikan

1. **Rate Limiting**: Aplikasi menggunakan delay otomatis untuk menghindari deteksi. Proses scraping memerlukan waktu.

2. **Resource Usage**: Playwright memerlukan resource yang cukup besar. Pastikan sistem memiliki RAM yang cukup.

3. **Legal Compliance**: Pastikan penggunaan scraper sesuai dengan Terms of Service Google Trends.

4. **Network**: Koneksi internet yang stabil diperlukan untuk hasil optimal.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository ini
2. Buat branch untuk fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## 📄 Lisensi

MIT License - Lihat file LICENSE untuk detail lengkap.

## 🆘 Troubleshooting

### Error: Browser tidak ditemukan
```bash
npm run install-browsers
```

### Error: Permission denied
```bash
sudo npm install
# atau
npm install --unsafe-perm
```

### Error: Timeout saat scraping
- Periksa koneksi internet
- Tingkatkan nilai timeout di konfigurasi
- Kurangi jumlah concurrent requests

### Error: Blocked by Google
- Tunggu beberapa saat sebelum mencoba lagi
- Gunakan VPN atau proxy
- Tingkatkan delay antar request

---

**Dibuat dengan ❤️ untuk komunitas developer Indonesia**
