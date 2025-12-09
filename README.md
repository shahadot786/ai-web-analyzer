# 🌐 AI Web Analyzer

A comprehensive full-stack web analyzer with advanced AI-powered content analysis, built with Express.js, React.js, TypeScript, and Playwright. Extract, analyze, and understand any website with intelligent insights, SEO recommendations, and content quality scoring.

![Tech Stack](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

## ✨ Features

### 🔍 Smart Web Analysis
- **Playwright-powered scraping**: Handles JavaScript-rendered content and dynamic websites
- **Comprehensive extraction**: Titles, headings (H1-H6), paragraphs, links, images, and metadata
- **Intelligent content prioritization**: Automatically ranks content by importance
- **Robust error handling**: Handles timeouts, invalid URLs, and edge cases

### 🤖 Advanced AI Analysis
- **Content summarization**: AI-generated comprehensive summaries
- **Entity extraction**: Identifies people, organizations, locations, and technologies
- **Keyword analysis**: Extracts keywords with relevance scores (0-100)
- **Topic extraction**: Automatically identifies key topics and themes
- **Sentiment analysis**: Determines sentiment with confidence scores
- **Content categorization**: Classifies content into relevant categories
- **Readability scoring**: Flesch-Kincaid based readability analysis
- **Content quality scoring**: Overall content quality assessment (0-100)
- **Competitive insights**: Strategic recommendations for improvement

### 📊 Comprehensive Analytics
- **SEO insights**: Detailed SEO analysis with actionable recommendations
- **Link analysis**: Internal vs external links, broken link detection
- **Image analysis**: Alt text coverage and optimization metrics
- **Content metrics**: Word count, reading time, heading structure analysis
- **SEO scoring**: Overall SEO score from 0-100
- **Quality scoring**: Content quality assessment with specific insights

### 🎨 Modern UI/UX
- **Minimal, clean design**: Shows only essential data by default
- **Expandable sections**: Detailed data available on demand
- **Dark mode design**: Beautiful, modern dark theme with glassmorphism effects
- **Responsive layout**: Works perfectly on all screen sizes
- **Smooth animations**: Micro-interactions and transitions for better UX
- **Real-time feedback**: Loading states, error messages, and progress indicators

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd ai-web-analyzer
\`\`\`

2. **Install backend dependencies**
\`\`\`bash
cd backend
npm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your Gemini API key:
\`\`\`env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
\`\`\`

4. **Install frontend dependencies**
\`\`\`bash
cd ../frontend
npm install
\`\`\`

### Running the Application

1. **Start the backend server** (in the `backend` directory):
\`\`\`bash
npm run dev
\`\`\`
Backend will run on http://localhost:3001

2. **Start the frontend** (in the `frontend` directory):
\`\`\`bash
npm run dev
\`\`\`
Frontend will run on http://localhost:5173

3. **Open your browser** and navigate to http://localhost:5173

## 📖 API Documentation

### POST /api/scrape
Analyze a website with comprehensive AI insights.

**Request Body:**
\`\`\`json
{
  "url": "https://example.com",
  "options": {
    "waitForSelector": "optional-css-selector",
    "timeout": 30000,
    "includeAIAnalysis": true
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "data": {
      "url": "https://example.com",
      "title": "Page Title",
      "headings": { "h1": [], "h2": [], ... },
      "paragraphs": [{ "text": "...", "summary": "...", "importance": 85 }],
      "links": [{ "text": "...", "href": "...", "isInternal": true }],
      "images": [{ "src": "...", "alt": "..." }],
      "metadata": { ... }
    },
    "aiAnalysis": {
      "contentSummary": "...",
      "keyTopics": [],
      "sentiment": "positive",
      "sentimentConfidence": 85,
      "readabilityScore": 75,
      "seoInsights": { ... },
      "contentCategories": [],
      "entities": {
        "people": [],
        "organizations": [],
        "locations": [],
        "technologies": []
      },
      "keywords": [{ "keyword": "...", "relevance": 95 }],
      "contentQualityScore": 82,
      "contentQualityInsights": [],
      "competitiveInsights": []
    },
    "analytics": {
      "totalWords": 1500,
      "readingTime": 7,
      "linkAnalysis": { ... },
      "imageAnalysis": { ... },
      "headingAnalysis": { ... },
      "seoScore": 85
    }
  }
}
\`\`\`

### GET /api/scrape/:id
Retrieve a specific analysis result by ID.

### GET /api/history
Get analysis history (last 50 results).

### GET /api/health
Health check endpoint.

## 🏗️ Project Structure

\`\`\`
ai-web-analyzer/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── scraper.service.ts    # Playwright scraping logic
│   │   │   ├── ai.service.ts          # Gemini AI integration
│   │   │   └── analytics.service.ts   # Analytics generation
│   │   ├── routes/
│   │   │   └── scraper.routes.ts      # API routes
│   │   ├── middleware/
│   │   │   ├── validation.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript types
│   │   └── server.ts                  # Express server
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ResultsDisplay.tsx     # Results UI component
    │   ├── services/
    │   │   └── api.ts                 # API client
    │   ├── App.tsx                    # Main app component
    │   └── index.css                  # Design system
    ├── package.json
    └── vite.config.ts
\`\`\`

## 🛠️ Technologies Used

### Backend
- **Express.js**: Web framework
- **TypeScript**: Type-safe JavaScript
- **Playwright**: Headless browser automation
- **Google Gemini AI**: Advanced AI-powered content analysis
- **Zod**: Schema validation
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: API rate limiting

### Frontend
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Axios**: HTTP client
- **Lucide React**: Icon library
- **CSS Variables**: Design system

## 🎯 Use Cases

- **SEO Analysis**: Comprehensive SEO optimization opportunities and recommendations
- **Content Research**: Extract and analyze content from competitor websites
- **Content Quality Assessment**: Evaluate content quality with AI-powered insights
- **Entity Extraction**: Identify key people, organizations, locations, and technologies
- **Keyword Research**: Extract relevant keywords with importance scores
- **Website Audits**: Perform comprehensive website audits with actionable insights
- **Competitive Analysis**: Get strategic recommendations for improvement
- **Content Migration**: Extract content for migration purposes
- **Market Research**: Analyze content trends and strategies across multiple sites

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse (100 requests per 15 minutes)
- **Helmet.js**: Sets security-related HTTP headers
- **CORS**: Configured for specific origins
- **Input Validation**: Zod schema validation for all inputs
- **Error Handling**: Comprehensive error handling and sanitization

## 🚧 Error Handling

The application handles various edge cases:
- Invalid URLs
- Timeout errors
- Network failures
- JavaScript-heavy websites
- Protected/blocked content
- Missing or malformed data
- API rate limits
- AI analysis failures

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | 3001 |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |
| `NODE_ENV` | Environment mode | development |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Google Gemini AI for powerful content analysis
- Playwright for robust web scraping
- React and Vite for excellent developer experience

---

**Built with ❤️ using TypeScript, React, and Express.js**
