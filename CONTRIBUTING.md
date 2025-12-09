# Contributing to AI Web Analyzer

Thank you for your interest in contributing to AI Web Analyzer! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences
- Accept responsibility and apologize for mistakes

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/ai-web-analyzer.git
   cd ai-web-analyzer
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original/ai-web-analyzer.git
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)
- Google Gemini API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
GEMINI_API_KEY=your_api_key_here
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Project Structure

```
ai-web-analyzer/
├── backend/
│   ├── src/
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── services/       # API client
    │   ├── App.tsx         # Main app
    │   └── index.css       # Styles
    ├── package.json
    └── vite.config.ts
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use strict mode

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### React Components

- Use functional components with hooks
- Keep components focused on a single responsibility
- Extract reusable logic into custom hooks
- Use TypeScript interfaces for props

### Example:

```typescript
interface ButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export default function Button({ onClick, label, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(export): add Excel export functionality

Implemented comprehensive Excel export with multiple sheets including
summary, AI analysis, entities, keywords, and SEO insights.

Closes #123
```

```
fix(scraper): handle timeout errors gracefully

Added fallback strategy for websites that timeout on networkidle.
Now retries with domcontentloaded strategy.
```

## Pull Request Process

1. **Update your fork**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Make your changes** following the coding standards

3. **Test your changes**:
   ```bash
   # Backend
   cd backend
   npm run build
   npm run dev

   # Frontend
   cd frontend
   npm run build
   npm run dev
   ```

4. **Commit your changes** following commit guidelines

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all checks pass

### PR Checklist

- [ ] Code follows project coding standards
- [ ] All tests pass
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] Commit messages follow guidelines
- [ ] No merge conflicts
- [ ] PR description is clear and complete

## Testing

### Manual Testing

1. Test the feature in the browser
2. Test edge cases and error scenarios
3. Test on different screen sizes (responsive design)
4. Verify no console errors

### Future: Automated Tests

We plan to add automated testing. Contributions to testing infrastructure are welcome!

## Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Document complex algorithms
- Explain non-obvious code decisions

### Example:

```typescript
/**
 * Analyzes website content using Google Gemini AI
 * @param scrapedData - The scraped website data
 * @returns Comprehensive AI analysis including summary, topics, sentiment, etc.
 */
async analyzeContent(scrapedData: ScrapedData): Promise<AIAnalysis> {
  // Implementation
}
```

### README Updates

- Update README.md for new features
- Add examples and screenshots
- Keep installation instructions current

## Feature Requests

Have an idea for a new feature? Great!

1. **Check existing issues** to avoid duplicates
2. **Open a new issue** with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
3. **Wait for feedback** before starting work

## Bug Reports

Found a bug? Help us fix it!

1. **Check existing issues** to avoid duplicates
2. **Open a new issue** with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

## Questions?

- Open an issue with the `question` label
- Join our community discussions
- Contact the maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AI Web Analyzer! 🎉
