# Usage Examples & Screenshots

Comprehensive guide with examples and visual demonstrations of AI Web Analyzer features.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Advanced Features](#advanced-features)
- [Export Options](#export-options)
- [Theme Customization](#theme-customization)
- [API Usage](#api-usage)
- [Common Use Cases](#common-use-cases)

## Quick Start

### 1. Start the Application

**Backend**:
```bash
cd backend
npm install
npm run dev
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

### 2. Access the Application

Open your browser and navigate to `http://localhost:5173`

### 3. Analyze Your First Website

1. Enter a URL (e.g., `https://example.com`)
2. Click "Analyze Website"
3. Wait for the analysis to complete
4. Explore the results!

## Basic Usage

### Analyzing a Website

**Step 1**: Enter URL
```
Input: https://techcrunch.com
```

**Step 2**: View Results

The analysis provides:
- **AI Summary**: Comprehensive content overview
- **Key Topics**: Main themes identified
- **SEO Score**: Overall SEO quality (0-100)
- **Content Quality Score**: Content assessment (0-100)
- **Sentiment Analysis**: Positive/Negative/Neutral with confidence
- **Readability Score**: How easy the content is to read

**Example Output**:
```
Title: TechCrunch - Startup and Technology News
SEO Score: 87/100
Quality Score: 82/100

AI Summary:
"TechCrunch is a leading technology media property, dedicated to 
obsessively profiling startups, reviewing new Internet products, 
and breaking tech news..."

Key Topics:
- Technology
- Startups
- Innovation
- Venture Capital
- Product Reviews

Sentiment: Positive (85% confidence)
Readability: 72/100
```

### Understanding the Results

#### 1. **Minimal Display (Default)**

By default, you see:
- Top 5 most important paragraphs
- Top 10 most relevant links
- First 6 images
- H1 and H2 headings only

#### 2. **Expandable Sections**

Click "Show All" to expand:
- All headings (H3-H6)
- All paragraphs with summaries
- All links (internal/external)
- All images with alt text info

#### 3. **Advanced Insights**

Expand to view:
- **Entities**: People, organizations, locations, technologies
- **Keywords**: Ranked by relevance (0-100%)
- **Content Quality Insights**: Specific improvement suggestions
- **Competitive Insights**: Strategic recommendations

## Advanced Features

### 1. Entity Extraction

**Example**:
```
Analyzing: https://apple.com/newsroom

Entities Detected:
├── People: Tim Cook, Craig Federighi
├── Organizations: Apple Inc., App Store
├── Locations: Cupertino, California
└── Technologies: iPhone, iOS, M3 chip
```

### 2. Keyword Analysis

**Example**:
```
Top Keywords (with relevance):
1. "artificial intelligence" - 95%
2. "machine learning" - 87%
3. "data privacy" - 82%
4. "user experience" - 78%
5. "innovation" - 75%
```

### 3. Content Quality Assessment

**Example**:
```
Content Quality Score: 85/100

Insights:
✓ Content is comprehensive with good depth
✓ Well-structured with clear headings
✓ Good use of visual elements
⚠ Could improve internal linking
⚠ Some paragraphs are quite long
```

### 4. SEO Analysis

**Example**:
```
SEO Insights:

Title Quality: Excellent - 58 characters
Meta Description: Good - 142 characters
Heading Structure: Proper H1-H3 hierarchy
Keyword Density: Optimal distribution

Recommendations:
• Add more internal links to related content
• Improve alt text coverage (currently 75%)
• Consider adding FAQ schema markup
• Optimize images for faster loading
```

## Export Options

### 1. PDF Export

**Usage**:
1. Click "PDF" button in results header
2. Wait for generation (2-5 seconds)
3. PDF downloads automatically

**PDF Contents**:
- Executive summary with scores
- Complete AI analysis
- Entities and keywords
- SEO insights and recommendations
- Content quality assessment
- Competitive insights
- Analytics data

**Example Filename**:
```
ai-web-analyzer-techcrunch-startup-and-technology-news-1702123456.pdf
```

### 2. Excel Export

**Usage**:
1. Click "Excel" button
2. Excel file downloads immediately

**Workbook Structure**:
```
Sheet 1: Summary (Scores, metrics, URL, timestamp)
Sheet 2: AI Analysis (Summary, topics, sentiment, categories)
Sheet 3: Entities (People, organizations, locations, technologies)
Sheet 4: Keywords (Keyword, relevance score)
Sheet 5: SEO Insights (Quality metrics, recommendations)
Sheet 6: Content Quality (Insights and suggestions)
Sheet 7: Competitive Insights (Strategic recommendations)
Sheet 8: Headings (All H1-H6 with hierarchy)
Sheet 9: Links (URL, text, type)
Sheet 10: Images (URL, alt text, dimensions)
```

### 3. JSON Export

**Usage**:
1. Click "JSON" button
2. JSON file downloads with complete raw data

**Example Structure**:
```json
{
  "id": "uuid-string",
  "data": {
    "url": "https://example.com",
    "title": "Page Title",
    "headings": { ... },
    "paragraphs": [ ... ],
    "links": [ ... ],
    "images": [ ... ]
  },
  "aiAnalysis": {
    "contentSummary": "...",
    "keyTopics": [ ... ],
    "entities": { ... },
    "keywords": [ ... ]
  },
  "analytics": { ... }
}
```

## Theme Customization

### Switching Themes

**Dark Mode** (Default):
- Click the Sun icon in the header
- Theme switches to light mode

**Light Mode**:
- Click the Moon icon in the header
- Theme switches to dark mode

**Persistence**:
- Your theme preference is saved in localStorage
- Automatically applied on next visit

### Theme Comparison

**Dark Mode**:
- Calm blue color scheme
- Easy on the eyes for extended use
- Professional appearance
- Better for low-light environments

**Light Mode**:
- Clean, bright interface
- High contrast for readability
- Better for well-lit environments
- Familiar traditional web design

## API Usage

### Using cURL

**Analyze a website**:
```bash
curl -X POST http://localhost:3001/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "options": {
      "timeout": 30000,
      "includeAIAnalysis": true
    }
  }'
```

**Download PDF**:
```bash
curl http://localhost:3001/api/export/pdf/your-result-id \
  -o report.pdf
```

### Using JavaScript/TypeScript

```typescript
import axios from 'axios';

// Analyze website
const analyzeWebsite = async (url: string) => {
  const response = await axios.post('http://localhost:3001/api/scrape', {
    url,
    options: { includeAIAnalysis: true }
  });
  return response.data.data;
};

// Usage
const result = await analyzeWebsite('https://example.com');
console.log('SEO Score:', result.analytics.seoScore);
console.log('Summary:', result.aiAnalysis.contentSummary);
```

### Using Python

```python
import requests

# Analyze website
response = requests.post('http://localhost:3001/api/scrape', json={
    'url': 'https://example.com',
    'options': {
        'includeAIAnalysis': True
    }
})

result = response.json()['data']
print(f"SEO Score: {result['analytics']['seoScore']}")
print(f"Summary: {result['aiAnalysis']['contentSummary']}")
```

## Common Use Cases

### 1. SEO Audit

**Scenario**: Audit your website's SEO performance

**Steps**:
1. Analyze your website
2. Review SEO score and insights
3. Check heading structure
4. Verify meta descriptions
5. Review alt text coverage
6. Export PDF report for stakeholders

**Key Metrics to Watch**:
- SEO Score > 70
- Proper H1-H6 hierarchy
- Alt text coverage > 80%
- Optimal keyword density

### 2. Competitor Analysis

**Scenario**: Analyze competitor websites

**Steps**:
1. Analyze competitor site
2. Review content quality score
3. Check entities and keywords
4. Read competitive insights
5. Compare with your site
6. Export Excel for detailed comparison

**What to Look For**:
- Content depth and quality
- Keyword strategies
- Technologies used
- Content structure

### 3. Content Quality Check

**Scenario**: Assess content before publishing

**Steps**:
1. Analyze draft content URL
2. Review readability score
3. Check content quality insights
4. Verify heading structure
5. Ensure proper keyword usage
6. Make improvements based on suggestions

**Target Scores**:
- Readability: 60-80 (optimal)
- Content Quality: > 75
- SEO Score: > 70

### 4. Bulk Website Analysis

**Scenario**: Analyze multiple websites

**Steps**:
1. Use API with script
2. Loop through URL list
3. Collect results
4. Export to Excel for each
5. Create comparison spreadsheet

**Example Script**:
```javascript
const urls = [
  'https://site1.com',
  'https://site2.com',
  'https://site3.com'
];

for (const url of urls) {
  const result = await analyzeWebsite(url);
  console.log(`${url}: SEO ${result.analytics.seoScore}/100`);
}
```

## Tips & Best Practices

### 1. Optimal Analysis

- Use specific page URLs, not just homepages
- Allow 30-60 seconds for complex sites
- Ensure stable internet connection
- Analyze during off-peak hours for faster results

### 2. Interpreting Scores

**SEO Score**:
- 90-100: Excellent
- 70-89: Good
- 50-69: Needs improvement
- <50: Requires significant work

**Content Quality**:
- 85-100: Outstanding
- 70-84: Good
- 55-69: Average
- <55: Needs improvement

### 3. Export Best Practices

- Use PDF for presentations and reports
- Use Excel for detailed analysis and comparisons
- Use JSON for programmatic access and integration

### 4. Performance Tips

- Close unnecessary browser tabs
- Clear browser cache if experiencing issues
- Use Chrome/Firefox for best compatibility
- Ensure backend has sufficient resources

## Troubleshooting

### Common Issues

**1. Analysis Timeout**:
- Solution: Increase timeout in options
- Try analyzing specific pages instead of homepage

**2. Export Not Working**:
- Solution: Check browser popup blocker
- Ensure sufficient disk space

**3. Theme Not Persisting**:
- Solution: Check browser localStorage settings
- Clear cache and try again

**4. WebSocket Connection Failed**:
- Solution: Check firewall settings
- Verify backend is running

## Support

Need help? Check:
- [API Documentation](./API_DOCUMENTATION.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Deployment Guide](./DEPLOYMENT.md)
- GitHub Issues

---

Happy analyzing! 🚀
