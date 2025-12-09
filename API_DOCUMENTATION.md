# API Documentation

Comprehensive API documentation for AI Web Analyzer backend endpoints.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Currently, the API does not require authentication. Rate limiting is applied: **100 requests per 15 minutes** per IP address.

---

## Endpoints

### 1. Analyze Website

Scrape and analyze a website with comprehensive AI insights.

**Endpoint:** `POST /api/scrape`

**Request Body:**

```json
{
  "url": "https://example.com",
  "options": {
    "waitForSelector": "optional-css-selector",
    "timeout": 30000,
    "includeAIAnalysis": true
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | The URL to analyze (must be valid HTTP/HTTPS URL) |
| `options.waitForSelector` | string | No | CSS selector to wait for before scraping |
| `options.timeout` | number | No | Timeout in milliseconds (default: 60000) |
| `options.includeAIAnalysis` | boolean | No | Whether to include AI analysis (default: true) |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "data": {
      "url": "https://example.com",
      "title": "Page Title",
      "headings": {
        "h1": ["Main Heading"],
        "h2": ["Subheading 1", "Subheading 2"],
        "h3": [],
        "h4": [],
        "h5": [],
        "h6": []
      },
      "paragraphs": [
        {
          "text": "Paragraph content...",
          "summary": "AI-generated summary...",
          "importance": 85
        }
      ],
      "links": [
        {
          "text": "Link text",
          "href": "https://example.com/page",
          "isInternal": true,
          "isExternal": false
        }
      ],
      "images": [
        {
          "src": "https://example.com/image.jpg",
          "alt": "Image description",
          "width": 800,
          "height": 600
        }
      ],
      "metadata": {
        "description": "Meta description",
        "keywords": "keyword1, keyword2",
        "author": "Author name",
        "ogTitle": "Open Graph title",
        "ogDescription": "Open Graph description",
        "ogImage": "https://example.com/og-image.jpg"
      },
      "scrapedAt": "2025-12-09T15:30:00.000Z"
    },
    "aiAnalysis": {
      "contentSummary": "Comprehensive AI-generated summary...",
      "keyTopics": ["Topic 1", "Topic 2", "Topic 3"],
      "sentiment": "positive",
      "sentimentConfidence": 85,
      "readabilityScore": 75,
      "seoInsights": {
        "titleQuality": "Good - 55 characters",
        "metaDescriptionQuality": "Excellent - 145 characters",
        "headingStructure": "Good - proper H1-H3 hierarchy",
        "keywordDensity": "Optimal keyword distribution",
        "recommendations": [
          "Add more internal links",
          "Improve alt text coverage"
        ]
      },
      "contentCategories": ["Technology", "Business"],
      "entities": {
        "people": ["John Doe", "Jane Smith"],
        "organizations": ["Company Inc", "Organization Name"],
        "locations": ["New York", "San Francisco"],
        "technologies": ["React", "Node.js", "TypeScript"]
      },
      "keywords": [
        { "keyword": "web development", "relevance": 95 },
        { "keyword": "AI analysis", "relevance": 87 }
      ],
      "contentQualityScore": 82,
      "contentQualityInsights": [
        "Content is comprehensive with good depth",
        "Well-structured with clear headings"
      ],
      "competitiveInsights": [
        "Consider adding more visual content",
        "Improve page load speed for better UX"
      ]
    },
    "analytics": {
      "totalWords": 1500,
      "readingTime": 7,
      "linkAnalysis": {
        "totalLinks": 25,
        "internalLinks": 15,
        "externalLinks": 10,
        "brokenLinks": 0
      },
      "imageAnalysis": {
        "totalImages": 12,
        "imagesWithAlt": 10,
        "imagesWithoutAlt": 2,
        "altTextCoverage": 83
      },
      "headingAnalysis": {
        "totalHeadings": 18,
        "h1Count": 1,
        "h2Count": 5,
        "h3Count": 8,
        "h4Count": 4,
        "h5Count": 0,
        "h6Count": 0,
        "hasProperHierarchy": true
      },
      "seoScore": 85
    }
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid URL or parameters
- `408 Request Timeout` - Website took too long to respond
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error during analysis

---

### 2. Get Analysis Result

Retrieve a specific analysis result by ID.

**Endpoint:** `GET /api/scrape/:id`

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | UUID of the analysis result |

**Response:** `200 OK`

Same structure as the analyze endpoint response.

**Error Responses:**

- `404 Not Found` - Analysis result not found

---

### 3. Get Analysis History

Get the last 50 analysis results.

**Endpoint:** `GET /api/history`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "url": "https://example.com",
      "timestamp": "2025-12-09T15:30:00.000Z"
    }
  ]
}
```

---

### 4. Export to PDF

Generate and download a PDF report of an analysis.

**Endpoint:** `GET /api/export/pdf/:id`

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | UUID of the analysis result |

**Response:** `200 OK`

Returns a PDF file with headers:
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="ai-web-analyzer-[title]-[timestamp].pdf"`

**Error Responses:**

- `404 Not Found` - Analysis result not found
- `500 Internal Server Error` - PDF generation failed

---

### 5. Health Check

Check if the server is running.

**Endpoint:** `GET /api/health`

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-09T15:30:00.000Z"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Window:** 15 minutes
- **Max Requests:** 100 per IP address
- **Headers:** Standard rate limit headers are included in responses

When rate limit is exceeded, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input parameters |
| 404 | Not Found - Resource doesn't exist |
| 408 | Request Timeout - Website took too long |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server-side error |

---

## Examples

### cURL Examples

**Analyze a website:**

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

**Get analysis result:**

```bash
curl http://localhost:3001/api/scrape/your-uuid-here
```

**Download PDF:**

```bash
curl http://localhost:3001/api/export/pdf/your-uuid-here \
  -o report.pdf
```

### JavaScript/TypeScript Examples

**Using Axios:**

```typescript
import axios from 'axios';

// Analyze website
const analyzeWebsite = async (url: string) => {
  try {
    const response = await axios.post('http://localhost:3001/api/scrape', {
      url,
      options: {
        includeAIAnalysis: true
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
};

// Get result
const getResult = async (id: string) => {
  const response = await axios.get(`http://localhost:3001/api/scrape/${id}`);
  return response.data.data;
};

// Download PDF
const downloadPDF = async (id: string, filename: string) => {
  const response = await axios.get(
    `http://localhost:3001/api/export/pdf/${id}`,
    { responseType: 'blob' }
  );
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
```

---

## Notes

- Analysis results are stored in memory and limited to the last 50 results
- For production use, implement persistent storage (database)
- PDF generation requires Puppeteer and may take a few seconds
- Large websites may take longer to analyze (up to 60 seconds)
- WebSocket support is prepared but not yet implemented

---

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
