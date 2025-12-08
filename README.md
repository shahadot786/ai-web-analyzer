# 🌐 AI-Powered Website Scraper

A comprehensive full-stack website scraper with AI-powered content analysis, built with Express.js, React.js, TypeScript, and Playwright. Perfect for extracting, analyzing, and understanding any website with intelligent insights.

![Tech Stack](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

## ✨ Features

### 🔍 Smart Web Scraping
- **Playwright-powered**: Handles JavaScript-rendered content and dynamic websites
- **Comprehensive extraction**: Titles, headings (H1-H6), paragraphs, links, images, and metadata
- **Error handling**: Robust error handling for timeouts, invalid URLs, and edge cases

### 🤖 AI-Powered Analysis
- **Content summarization**: AI-generated summaries for each paragraph
- **Topic extraction**: Automatically identifies key topics and themes
- **Sentiment analysis**: Determines content sentiment (positive/negative/neutral)
- **Content categorization**: Classifies content into relevant categories
- **Readability scoring**: Calculates how easy the content is to read

### 📊 Advanced Analytics
- **SEO insights**: Comprehensive SEO analysis with actionable recommendations
- **Link analysis**: Internal vs external links, broken link detection
- **Image analysis**: Alt text coverage and image optimization metrics
- **Content metrics**: Word count, reading time, heading structure analysis
- **SEO scoring**: Overall SEO score from 0-100

### 🎨 Modern UI/UX
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
cd simple-blog-scraper
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
Scrape and analyze a website.

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
      "paragraphs": [{ "text": "...", "summary": "..." }],
      "links": [{ "text": "...", "href": "...", "isInternal": true }],
      "images": [{ "src": "...", "alt": "..." }],
      "metadata": { ... }
    },
    "aiAnalysis": {
      "contentSummary": "...",
      "keyTopics": [],
      "sentiment": "positive",
      "readabilityScore": 75,
      "seoInsights": { ... },
      "contentCategories": []
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
Retrieve a specific scraping result by ID.

### GET /api/history
Get scraping history (last 50 results).

### GET /api/health
Health check endpoint.

## 🏗️ Project Structure

\`\`\`
simple-blog-scraper/
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
- **Google Gemini AI**: AI-powered content analysis
- **Zod**: Schema validation
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: API rate limiting

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Axios**: HTTP client
- **Lucide React**: Icon library
- **CSS Variables**: Design system

## 🎯 Use Cases

- **SEO Analysis**: Analyze websites for SEO optimization opportunities
- **Content Research**: Extract and analyze content from competitor websites
- **Data Collection**: Gather structured data from multiple websites
- **Website Audits**: Perform comprehensive website audits
- **Content Migration**: Extract content for migration purposes
- **Market Research**: Analyze content trends across multiple sites

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

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | 3001 |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |
| `NODE_ENV` | Environment mode | development |

## 🤝 Contributing

This is an interview project. Feel free to fork and modify for your own use!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Google Gemini AI for powerful content analysis
- Playwright for robust web scraping
- React and Vite for excellent developer experience

---

**Built with ❤️ using TypeScript, React, and Express.js**
