const { chromium } = require('playwright');
const UserAgent = require('user-agents');
require('dotenv').config();

class BrowserConfig {
  constructor() {
    this.userAgent = new UserAgent({ deviceCategory: 'desktop' });
  }

  async createBrowser() {
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-field-trial-config',
        '--disable-back-forward-cache',
        '--disable-ipc-flooding-protection',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--use-mock-keychain',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-default-apps',
        '--mute-audio',
        '--no-default-browser-check',
        '--autoplay-policy=user-gesture-required',
        '--disable-background-mode',
        '--disable-backgrounding-occluded-windows',
        '--disable-notifications',
        '--disable-component-update'
      ]
    });

    return browser;
  }

  async createStealthContext(browser) {
    const context = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      userAgent: this.userAgent.toString(),
      locale: 'en-US',
      timezoneId: 'America/New_York',
      permissions: [],
      extraHTTPHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });

    // Add stealth scripts to avoid detection
    await context.addInitScript(() => {
      // Override the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'plugins', {
        get: () => [
          {
            0: {
              type: 'application/x-google-chrome-pdf',
              suffixes: 'pdf',
              description: 'Portable Document Format'
            },
            description: 'Portable Document Format',
            filename: 'internal-pdf-viewer',
            length: 1,
            name: 'Chrome PDF Plugin'
          }
        ]
      });

      // Override the `languages` property to use a custom getter.
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en']
      });

      // Override the `webdriver` property to remove it.
      delete navigator.__proto__.webdriver;

      // Override the `permissions` property.
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );

      // Remove webdriver traces
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      // Chrome runtime
      window.chrome = {
        runtime: {}
      };

      // Mock chrome object
      Object.defineProperty(window, 'chrome', {
        writable: true,
        enumerable: true,
        configurable: false,
        value: {
          runtime: {}
        }
      });
    });

    return context;
  }

  async createPage(context) {
    const page = await context.newPage();
    
    // Set additional headers and properties
    await page.setExtraHTTPHeaders({
      'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1'
    });

    // Block unnecessary resources to speed up loading
    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    return page;
  }

  getRandomDelay() {
    const min = parseInt(process.env.SCRAPE_DELAY_MIN) || 2000;
    const max = parseInt(process.env.SCRAPE_DELAY_MAX) || 5000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

module.exports = BrowserConfig;
