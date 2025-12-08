import { chromium, Browser, Page } from 'playwright';
import type { ScrapedData } from '../types/index.js';
import { AppError } from '../types/index.js';

class ScraperService {
  private browser: Browser | null = null;

  async initBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeWebsite(
    url: string,
    options: { waitForSelector?: string; timeout?: number } = {}
  ): Promise<ScrapedData> {
    const { waitForSelector, timeout = 60000 } = options; // Increased default to 60s

    try {
      await this.initBrowser();
      
      if (!this.browser) {
        throw new AppError(500, 'Failed to initialize browser');
      }

      const page: Page = await this.browser.newPage({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });

      // Navigate to the URL with fallback strategy for heavy sites
      try {
        await page.goto(url, { 
          waitUntil: 'networkidle',
          timeout 
        });
      } catch (error: any) {
        // If networkidle times out, try with domcontentloaded
        if (error.message.includes('Timeout')) {
          console.log('Retrying with domcontentloaded strategy...');
          await page.goto(url, { 
            waitUntil: 'domcontentloaded',
            timeout: timeout / 2
          });
          // Wait a bit for dynamic content
          await page.waitForTimeout(3000);
        } else {
          throw error;
        }
      }

      // Wait for specific selector if provided
      if (waitForSelector) {
        await page.waitForSelector(waitForSelector, { timeout: 10000 });
      }

      // Extract data from the page
      const scrapedData = await page.evaluate(([pageUrl]) => {
        // Declare document for TypeScript - it exists in browser context
        const document = (globalThis as any).document;
        const result: any = {};
        
        result.title = document.title || '';
        
        result.headings = {
          h1: Array.from(document.querySelectorAll('h1')).map((h: any) => h.textContent?.trim() || ''),
          h2: Array.from(document.querySelectorAll('h2')).map((h: any) => h.textContent?.trim() || ''),
          h3: Array.from(document.querySelectorAll('h3')).map((h: any) => h.textContent?.trim() || ''),
          h4: Array.from(document.querySelectorAll('h4')).map((h: any) => h.textContent?.trim() || ''),
          h5: Array.from(document.querySelectorAll('h5')).map((h: any) => h.textContent?.trim() || ''),
          h6: Array.from(document.querySelectorAll('h6')).map((h: any) => h.textContent?.trim() || ''),
        };
        
        result.paragraphs = Array.from(document.querySelectorAll('p'))
          .map((p: any) => p.textContent?.trim() || '')
          .filter((text: string) => text.length > 20)
          .map((text: string) => ({ text }));
        
        result.links = Array.from(document.querySelectorAll('a[href]'))
          .map((a: any) => {
            const href = a.href;
            let absoluteHref = href;
            try {
              absoluteHref = new URL(href, pageUrl).href;
            } catch (e) {}
            
            let isInternal = false;
            try {
              const linkUrl = new URL(absoluteHref, pageUrl);
              const pageUrlObj = new URL(pageUrl);
              isInternal = linkUrl.hostname === pageUrlObj.hostname;
            } catch (e) {}
            
            return {
              text: a.textContent?.trim() || '',
              href: absoluteHref,
              isInternal,
              isExternal: !isInternal
            };
          })
          .filter((link: any) => link.href && link.href !== '#');
        
        result.images = Array.from(document.querySelectorAll('img'))
          .map((img: any) => {
            let src = img.src;
            try {
              src = new URL(img.src, pageUrl).href;
            } catch (e) {}
            
            return {
              src,
              alt: img.alt || '',
              width: img.naturalWidth || undefined,
              height: img.naturalHeight || undefined
            };
          })
          .filter((img: any) => img.src && !img.src.startsWith('data:'));
        
        const getMeta = (name: string) => {
          const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
          return meta?.getAttribute('content') || undefined;
        };
        
        result.metadata = {
          description: getMeta('description'),
          keywords: getMeta('keywords'),
          author: getMeta('author'),
          ogTitle: getMeta('og:title'),
          ogDescription: getMeta('og:description'),
          ogImage: getMeta('og:image')
        };
        
        return result;
      }, [url]);

      await page.close();

      return {
        url,
        ...scrapedData,
        scrapedAt: new Date()
      };

    } catch (error: any) {
      if (error.message.includes('timeout')) {
        throw new AppError(408, 'Request timeout: The website took too long to respond');
      }
      if (error.message.includes('net::ERR')) {
        throw new AppError(400, 'Invalid URL or website is unreachable');
      }
      throw new AppError(500, `Scraping failed: ${error.message}`);
    }
  }
}

export const scraperService = new ScraperService();
