class CategoryFilter {
  constructor() {
    this.techKeywords = {
      // Programming & Development
      programming: [
        'javascript', 'python', 'react', 'nodejs', 'typescript', 'vue', 'angular',
        'docker', 'kubernetes', 'microservices', 'api', 'graphql', 'rest',
        'git', 'github', 'gitlab', 'devops', 'ci/cd', 'jenkins'
      ],
      
      // AI & Machine Learning
      ai: [
        'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
        'tensorflow', 'pytorch', 'openai', 'chatgpt', 'gpt', 'llm', 'nlp',
        'computer vision', 'reinforcement learning', 'transformer', 'bert',
        'stable diffusion', 'midjourney', 'dall-e'
      ],
      
      // Blockchain & Crypto
      blockchain: [
        'blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'nft', 'defi',
        'smart contract', 'web3', 'dao', 'metaverse', 'solidity', 'polygon',
        'binance', 'coinbase', 'metamask', 'opensea'
      ],
      
      // Cloud & Infrastructure
      cloud: [
        'aws', 'azure', 'google cloud', 'gcp', 'serverless', 'lambda',
        'cloud computing', 'saas', 'paas', 'iaas', 'edge computing',
        'cdn', 'load balancer', 'auto scaling'
      ],
      
      // Cybersecurity
      cybersecurity: [
        'cybersecurity', 'infosec', 'penetration testing', 'ethical hacking',
        'vulnerability', 'malware', 'ransomware', 'phishing', 'zero day',
        'encryption', 'vpn', 'firewall', 'intrusion detection', 'siem'
      ],
      
      // IoT & Hardware
      iot: [
        'internet of things', 'iot', 'raspberry pi', 'arduino', 'sensor',
        'embedded systems', 'edge device', 'smart home', 'wearable',
        'beacon', 'mqtt', 'zigbee', 'bluetooth', 'wifi 6'
      ],
      
      // Emerging Technologies
      emerging: [
        'quantum computing', 'augmented reality', 'virtual reality', 'ar', 'vr',
        'mixed reality', 'hologram', '5g', '6g', 'edge ai', 'neuromorphic',
        'biocomputing', 'dna storage', 'photonic computing'
      ],
      
      // Data & Analytics
      data: [
        'big data', 'data science', 'analytics', 'business intelligence',
        'data warehouse', 'etl', 'apache spark', 'hadoop', 'kafka',
        'elasticsearch', 'mongodb', 'postgresql', 'redis', 'cassandra'
      ]
    };
    
    this.nicheTechTerms = [
      // Framework & Libraries yang sedang trending
      'svelte', 'solid.js', 'qwik', 'astro', 'remix', 'next.js', 'nuxt',
      'vite', 'esbuild', 'turbo', 'nx', 'lerna', 'rush',
      
      // Backend Technologies
      'rust', 'go', 'deno', 'bun', 'fastapi', 'nestjs', 'express',
      'spring boot', 'django', 'flask', 'laravel', 'symfony',
      
      // Database & Storage
      'supabase', 'planetscale', 'neon', 'cockroachdb', 'dgraph',
      'neo4j', 'arangodb', 'influxdb', 'timescaledb',
      
      // DevOps & Tools
      'terraform', 'ansible', 'helm', 'istio', 'prometheus', 'grafana',
      'jaeger', 'zipkin', 'consul', 'vault', 'nomad',
      
      // AI/ML Specific
      'hugging face', 'langchain', 'vector database', 'pinecone', 'weaviate',
      'chroma', 'embeddings', 'fine-tuning', 'rag', 'prompt engineering'
    ];
  }

  isNicheTech(term) {
    const lowerTerm = term.toLowerCase();
    
    // Check against niche tech terms
    if (this.nicheTechTerms.some(niche => 
      lowerTerm.includes(niche.toLowerCase()) || 
      niche.toLowerCase().includes(lowerTerm)
    )) {
      return true;
    }
    
    // Check against categorized keywords
    for (const category in this.techKeywords) {
      if (this.techKeywords[category].some(keyword => 
        lowerTerm.includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(lowerTerm)
      )) {
        return true;
      }
    }
    
    return false;
  }

  isTech(term) {
    const lowerTerm = term.toLowerCase();
    
    // Check against categorized tech keywords (excluding niche terms)
    for (const category in this.techKeywords) {
      if (this.techKeywords[category].some(keyword => 
        lowerTerm.includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(lowerTerm)
      )) {
        return true;
      }
    }
    
    return false;
  }

  categorizeKeyword(keyword) {
    if (!keyword || typeof keyword !== 'string') {
      return ['other'];
    }

    const lowerKeyword = keyword.toLowerCase();
    const categories = [];

    // Check for tech keywords first
    if (this.isNicheTech(lowerKeyword)) {
      categories.push('niche');
    } else if (this.isTech(lowerKeyword)) {
      categories.push('tech');
    }

    // Check for entertainment/celebrity keywords
    const entertainmentKeywords = [
      'celebrity', 'actor', 'actress', 'singer', 'musician', 'artist', 'movie', 'film', 
      'tv show', 'series', 'music', 'album', 'concert', 'award', 'oscar', 'grammy',
      'netflix', 'disney', 'marvel', 'dc', 'star wars', 'game of thrones'
    ];

    // Check for sports keywords
    const sportsKeywords = [
      'football', 'soccer', 'basketball', 'baseball', 'tennis', 'golf', 'olympics',
      'world cup', 'nfl', 'nba', 'mlb', 'nhl', 'fifa', 'uefa', 'premier league',
      'champions league', 'super bowl', 'playoffs'
    ];

    // Check for news/politics keywords
    const newsKeywords = [
      'election', 'president', 'politics', 'government', 'congress', 'senate',
      'vote', 'campaign', 'policy', 'law', 'court', 'judge', 'scandal',
      'breaking news', 'crisis', 'protest', 'war', 'conflict'
    ];

    // Check for health/medical keywords
    const healthKeywords = [
      'health', 'medical', 'doctor', 'hospital', 'disease', 'virus', 'vaccine',
      'covid', 'pandemic', 'medicine', 'treatment', 'symptoms', 'diagnosis'
    ];

    // Check for business/finance keywords
    const businessKeywords = [
      'stock', 'market', 'economy', 'finance', 'investment', 'crypto', 'bitcoin',
      'company', 'business', 'ceo', 'earnings', 'profit', 'loss', 'merger',
      'acquisition', 'ipo', 'nasdaq', 'dow jones', 'sp500'
    ];

    // Categorize based on keyword matching
    if (entertainmentKeywords.some(word => lowerKeyword.includes(word))) {
      categories.push('entertainment');
    }
    
    if (sportsKeywords.some(word => lowerKeyword.includes(word))) {
      categories.push('sports');
    }
    
    if (newsKeywords.some(word => lowerKeyword.includes(word))) {
      categories.push('news');
    }
    
    if (healthKeywords.some(word => lowerKeyword.includes(word))) {
      categories.push('health');
    }
    
    if (businessKeywords.some(word => lowerKeyword.includes(word))) {
      categories.push('business');
    }

    // Check if it's a person's name (simple heuristic)
    const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
    if (namePattern.test(keyword.trim())) {
      categories.push('person');
    }

    // Check if it's a location (simple heuristic for countries/cities)
    const locationKeywords = [
      'united states', 'usa', 'america', 'canada', 'mexico', 'brazil', 'argentina',
      'uk', 'england', 'france', 'germany', 'italy', 'spain', 'russia', 'china',
      'japan', 'korea', 'india', 'australia', 'new zealand', 'south africa',
      'new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia',
      'san antonio', 'san diego', 'dallas', 'san jose', 'austin', 'jacksonville',
      'london', 'paris', 'berlin', 'madrid', 'rome', 'moscow', 'tokyo', 'beijing',
      'mumbai', 'delhi', 'sydney', 'melbourne', 'toronto', 'vancouver'
    ];

    if (locationKeywords.some(word => lowerKeyword.includes(word))) {
      categories.push('location');
    }

    // If no specific category found, mark as general
    if (categories.length === 0) {
      categories.push('general');
    }

    return categories;
  }

  filterTechTrends(trends) {
    return trends.filter(trend => {
      const title = trend.title || trend.query || trend.keyword || '';
      return this.isNicheTech(title);
    }).map(trend => ({
      ...trend,
      categories: this.categorizeKeyword(trend.title || trend.query || trend.keyword || ''),
      isNiche: true
    }));
  }

  scoreRelevance(term) {
    const lowerTerm = term.toLowerCase();
    let score = 0;
    
    // Higher score for niche terms
    if (this.nicheTechTerms.some(niche => 
      lowerTerm.includes(niche.toLowerCase())
    )) {
      score += 10;
    }
    
    // Medium score for categorized terms
    for (const keywords of Object.values(this.techKeywords)) {
      if (keywords.some(keyword => 
        lowerTerm.includes(keyword.toLowerCase())
      )) {
        score += 5;
        break;
      }
    }
    
    // Bonus for emerging/trending indicators
    const trendingIndicators = ['new', 'latest', '2024', '2025', 'beta', 'alpha', 'preview'];
    if (trendingIndicators.some(indicator => 
      lowerTerm.includes(indicator)
    )) {
      score += 3;
    }
    
    return score;
  }

  getTopNicheTrends(trends, limit = 10) {
    return trends
      .filter(trend => this.isNicheTech(trend.title || trend.query || ''))
      .map(trend => ({
        ...trend,
        relevanceScore: this.scoreRelevance(trend.title || trend.query || ''),
        categories: this.categorizeKeyword(trend.title || trend.query || '')
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  getKeywordSuggestions(category) {
    if (this.techKeywords[category]) {
      return this.techKeywords[category];
    }
    
    if (category === 'niche') {
      return this.nicheTechTerms;
    }
    
    return [];
  }

  getAllCategories() {
    return Object.keys(this.techKeywords).concat(['niche']);
  }
}

module.exports = CategoryFilter;