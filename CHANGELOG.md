# Changelog

All notable changes to the AI Web Analyzer project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-09

### Added
- **Project Rebranding**: Renamed from "simple-blog-scraper" to "AI Web Analyzer"
- **Enhanced AI Analysis**:
  - Entity extraction (people, organizations, locations, technologies)
  - Keyword analysis with relevance scores (0-100)
  - Content quality scoring (0-100)
  - Sentiment analysis with confidence scores
  - Competitive insights and strategic recommendations
  - Content structure recommendations
- **Minimal UI Design**:
  - Shows only essential data by default (top 5 paragraphs, 10 links, 6 images, H1/H2 headings)
  - Expandable sections for detailed data exploration
  - New sections for entities, keywords, quality insights, and competitive analysis
  - Improved visual hierarchy and spacing
- **Export Features**:
  - PDF export with professional template and comprehensive data
  - Excel export with multiple sheets (Summary, AI Analysis, Entities, Keywords, SEO, etc.)
  - JSON export for raw data access
- **Dependencies**:
  - Added `puppeteer` for PDF generation
  - Added `ws` for WebSocket support (prepared for future use)
  - Added `xlsx` for Excel export functionality
  - Added `jspdf`, `html2canvas`, `file-saver` for client-side exports

### Changed
- Updated all documentation with new branding
- Improved AI prompts for more insightful analysis
- Enhanced paragraph summarization with importance scoring
- Improved readability scoring using Flesch-Kincaid formula
- Updated frontend design system with better color coding

### Improved
- Parallel AI processing for faster analysis
- Better error handling and user feedback
- Type-safe implementation across frontend and backend
- More comprehensive SEO recommendations

## [1.0.0] - 2024-XX-XX

### Added
- Initial release as "simple-blog-scraper"
- Basic web scraping with Playwright
- AI-powered content analysis with Google Gemini
- SEO insights and recommendations
- Analytics dashboard
- Dark mode UI
- React frontend with TypeScript
- Express backend with TypeScript

---

## Upcoming Features

### [2.1.0] - Planned
- Real-time progress updates via WebSocket
- Scraping progress indicators
- Ability to cancel ongoing analysis
- URL caching for faster repeat analysis

### [2.2.0] - Planned
- Website comparison mode (side-by-side analysis)
- Scraping history with search and filter
- Bookmark/favorite functionality
- Sharing capability with shareable links

### [2.3.0] - Planned
- Dark/light mode toggle
- Enhanced mobile responsive design
- Performance optimizations
- Additional export formats

---

For more details about each release, see the [GitHub Releases](https://github.com/yourusername/ai-web-analyzer/releases) page.
