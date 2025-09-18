# Google Trends Scraper - All Trending Topics

🚀 **Aplikasi web scraping Google Trends yang mengambil semua trending topics dengan anti-detection menggunakan Playwright**

## ✨ Fitur Utama

- 🤖 **Anti-Detection**: Menggunakan stealth mode dengan Playwright untuk menghindari deteksi bot
- 🌍 **All Trending Topics**: Mengambil semua trending topics dari berbagai kategori
- ⚡ **Rate Limiting**: Sistem delay cerdas untuk menghindari pemblokiran
- 🌐 **Web Interface**: Dashboard modern dan responsif
- 📊 **Multiple Sources**: Mengambil data dari realtime trends, daily trends, dan trending overview
- 🔍 **Keyword Analysis**: Analisis mendalam untuk keyword tertentu
- 🧹 **Text Cleaning**: Pembersihan otomatis untuk kualitas data yang lebih baik
- 📝 **Console Logging**: Display trending topics di console untuk monitoring

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
   npx playwright install
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
Mengambil semua trending topics

**Query Parameters:**
- `geo` - Region code (default: US)
- `limit` - Jumlah hasil (default: 15)
- `includeRealtime` - Include realtime trends (default: true)
- `includeDaily` - Include daily trends (default: true)
- `includeTrendingOverview` - Include trending overview (default: false)
- `includeNewsLinks` - Include news links (default: false)

**Contoh Curl:**
```bash
# Basic request
curl "http://localhost:3000/api/trends"

# Dengan parameter
curl "http://localhost:3000/api/trends?geo=US&limit=10&includeNewsLinks=true"

# Untuk region Indonesia
curl "http://localhost:3000/api/trends?geo=ID&limit=20"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "jimmy kimmel fired",
      "volume": "500K+",
      "timeAgo": "1h ago",
      "source": "selector_1",
      "elementIndex": 1
    }
  ],
  "metadata": {
    "totalTrends": 25,
    "uniqueTrends": 25,
    "returnedTrends": 5,
    "geo": "US",
    "timestamp": "2025-09-18T00:01:08.418Z",
    "stats": {
      "totalRequests": 1,
      "activeRequests": 0,
      "maxConcurrent": 2,
      "lastRequestTime": "2025-09-18T00:01:03.593Z"
    },
    "includeNewsLinks": false,
    "newsLinksCount": 0
  },
  "timestamp": "2025-09-18T00:01:08.418Z"
}
```

### GET `/api/keyword/:keyword`
Analisis mendalam untuk keyword tertentu

**Query Parameters:**
- `geo` - Region code (default: US)
- `timeRange` - Time range (default: today 12-m)

**Contoh Curl:**
```bash
# Analisis keyword "artificial intelligence"
curl "http://localhost:3000/api/keyword/artificial%20intelligence"

# Dengan parameter geo dan timeRange
curl "http://localhost:3000/api/keyword/blockchain?geo=US&timeRange=today%2012-m"

# Untuk region Indonesia
curl "http://localhost:3000/api/keyword/teknologi?geo=ID"
```

### POST `/api/save-trends`
Menyimpan trending topics ke file JSON

**Body Parameters:**
- `geo` - Region code (default: US)
- `limit` - Jumlah hasil (default: 25)
- `techOnly` - Hanya teknologi (default: false)
- `includeRealtime` - Include realtime trends (default: true)
- `includeDaily` - Include daily trends (default: true)
- `includeTrendingOverview` - Include trending overview (default: true)
- `includeNewsLinks` - Include news links (default: false)
- `filename` - Nama file (opsional)

**Contoh Curl:**
```bash
# Basic save
curl -X POST "http://localhost:3000/api/save-trends" \
  -H "Content-Type: application/json" \
  -d '{}'

# Dengan parameter lengkap
curl -X POST "http://localhost:3000/api/save-trends" \
  -H "Content-Type: application/json" \
  -d '{
    "geo": "US",
    "limit": 50,
    "includeNewsLinks": true,
    "filename": "trends-today.json"
  }'

# Simpan untuk Indonesia dengan berita
curl -X POST "http://localhost:3000/api/save-trends" \
  -H "Content-Type: application/json" \
  -d '{
    "geo": "ID",
    "limit": 30,
    "includeNewsLinks": true
  }'
```

### GET `/api/stats`
Statistik scraper

**Contoh Curl:**
```bash
curl "http://localhost:3000/api/stats"
```

### GET `/api/categories`
Daftar kategori yang tersedia

**Contoh Curl:**
```bash
curl "http://localhost:3000/api/categories"
```

### GET `/health`
Health check endpoint

**Contoh Curl:**
```bash
curl "http://localhost:3000/health"
```

## 🌍 Sumber Data Trending

Aplikasi ini mengambil data dari berbagai sumber Google Trends:

### Realtime Trends
- Data trending yang sedang populer saat ini
- Update secara real-time
- Menggunakan trending overview sebagai sumber utama

### Daily Trends  
- Trending topics harian
- Data yang sudah diverifikasi dan difilter
- Mencakup berbagai kategori topik

### Trending Overview
- Overview lengkap dari semua trending topics
- Data yang sudah dibersihkan dan dioptimalkan
- Sumber utama untuk realtime trends
## 🛡️ Anti-Detection Features

1. **Stealth Mode**: Menggunakan konfigurasi browser yang menyerupai pengguna asli
2. **User Agent Rotation**: Rotasi user agent secara otomatis
3. **Human-like Delays**: Delay yang menyerupai perilaku manusia
4. **Rate Limiting**: Pembatasan request untuk menghindari spam detection
5. **Resource Blocking**: Memblokir resource yang tidak perlu untuk mempercepat loading
6. **Headers Manipulation**: Mengatur headers HTTP yang realistis
7. **Text Cleaning**: Pembersihan otomatis untuk menghilangkan noise dari data

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
📊 DAFTAR TRENDING TOPICS:
==================================================
1. jimmy kimmel fired
   📈 Volume: 500K+
   ⏰ Time: 1h ago
   📍 Source: selector_1

2. kimmel
   📈 Volume: 500K+
   ⏰ Time: 1h ago
   📍 Source: selector_1

3. what did jimmy kimmel do
   📈 Volume: 500K+
   ⏰ Time: 1h ago
   📍 Source: selector_1

✅ Total: 8 trending topics untuk region US
==================================================

📈 STATISTIK SCRAPING
==============================
Total trends ditemukan: 25
Unique trends: 25
Returned trends: 8
Region: US
Waktu scraping: 18/09/2025 00:01:08

Total requests: 2
Active requests: 0
Max concurrent: 2
```

## ⚠️ Penting untuk Diperhatikan

1. **Rate Limiting**: Aplikasi menggunakan delay otomatis untuk menghindari deteksi. Proses scraping memerlukan waktu.

2. **Resource Usage**: Playwright memerlukan resource yang cukup besar. Pastikan sistem memiliki RAM yang cukup.

3. **Legal Compliance**: Pastikan penggunaan scraper sesuai dengan Terms of Service Google Trends.

4. **Network**: Koneksi internet yang stabil diperlukan untuk hasil optimal.

5. **Text Cleaning**: Data trending akan dibersihkan secara otomatis untuk menghilangkan noise dan duplikasi.

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
npx playwright install
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
