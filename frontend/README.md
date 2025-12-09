# AI Web Analyzer - Frontend

Modern React frontend for the AI Web Analyzer application with TypeScript, Vite, and a beautiful dark mode design.

## 🎨 Features

- **Minimal, Clean UI**: Shows only essential data by default with expandable sections
- **Dark Mode Design**: Beautiful glassmorphism effects and modern aesthetics
- **Responsive Layout**: Works perfectly on all screen sizes
- **Real-time Analysis**: Live feedback during website analysis
- **Interactive Components**: Expandable sections for detailed data exploration
- **Type-Safe**: Full TypeScript support for better development experience

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ResultsDisplay.tsx    # Main results display component
│   ├── services/
│   │   └── api.ts                # API client and TypeScript types
│   ├── App.tsx                   # Main application component
│   ├── index.css                 # Design system and global styles
│   └── main.tsx                  # Application entry point
├── public/
│   └── scraper_logo.png          # Application logo
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at http://localhost:5173

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Technologies

- **React 19**: Latest React with improved performance
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API requests
- **Lucide React**: Beautiful icon library
- **CSS Variables**: Custom design system

## 📦 Key Components

### ResultsDisplay
Main component for displaying analysis results with:
- Minimal data display by default
- Expandable sections for detailed information
- Entity extraction display
- Keyword analysis with relevance scores
- SEO insights and recommendations
- Content quality metrics
- Competitive insights

### App
Main application component handling:
- URL input and validation
- Analysis request management
- Loading states
- Error handling
- Results display

## 🎨 Design System

The application uses a comprehensive design system defined in `index.css`:

- **Color Palette**: Dark mode optimized colors
- **Spacing System**: Consistent spacing scale
- **Typography**: Modern font stack with proper hierarchy
- **Components**: Reusable button, card, and badge styles
- **Animations**: Smooth transitions and micro-interactions

## 🔧 Configuration

### API Base URL
Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

## 📝 License

MIT License
