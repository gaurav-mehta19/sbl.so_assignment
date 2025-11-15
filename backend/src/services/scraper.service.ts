import { chromium } from 'playwright';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Try Playwright first, fall back to HTTP scraper
export async function scrapeWebsite(url: string): Promise<string> {
  // Check if Playwright is available
  const usePlaywright = process.env.USE_PLAYWRIGHT === 'true';
  
  if (usePlaywright) {
    try {
      return await scrapeWithPlaywright(url);
    } catch (error) {
      console.warn('⚠️ Playwright failed, falling back to HTTP scraper:', error instanceof Error ? error.message : 'Unknown error');
      return await scrapeWithHTTP(url);
    }
  } else {
    // Use HTTP scraper by default (works on all platforms)
    return await scrapeWithHTTP(url);
  }
}

// HTTP-based scraper using axios + cheerio (lightweight, works everywhere)
async function scrapeWithHTTP(url: string): Promise<string> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🌐 Scraping with HTTP (attempt ${attempt}/${maxRetries}):`, url);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0',
        },
        timeout: 30000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500, // Accept 4xx errors to handle them
      });

      // Check if we got blocked
      if (response.status === 403) {
        throw new Error('Website blocked the request (403 Forbidden). The site may have anti-scraping protection.');
      }

      if (response.status === 429) {
        throw new Error('Rate limited (429). Please try again later.');
      }

      if (response.status >= 400) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const $ = cheerio.load(response.data);

      // Remove script, style, and other non-content elements
      $('script, style, noscript, iframe').remove();

      // Try to extract content from main content areas first
      let content = '';
      
      // Try common content selectors
      const contentSelectors = ['main', 'article', '[role="main"]', '#content', '.content', 'body'];
      for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          content = element.text();
          if (content.trim().length > 100) { // Found substantial content
            break;
          }
        }
      }

      // Fallback to body if nothing found
      if (content.trim().length < 100) {
        content = $('body').text();
      }

      // Also extract meta description and title for context
      const title = $('title').text() || '';
      const description = $('meta[name="description"]').attr('content') || 
                         $('meta[property="og:description"]').attr('content') || '';

      // Combine title, description, and content
      let fullContent = '';
      if (title) fullContent += `Title: ${title}\n\n`;
      if (description) fullContent += `Description: ${description}\n\n`;
      fullContent += content;

      // Clean up the content
      const cleanedContent = fullContent
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
        .trim();

      // Check if we got meaningful content
      if (cleanedContent.length < 50) {
        throw new Error('Website returned insufficient content. The site may load content dynamically with JavaScript. Try enabling USE_PLAYWRIGHT=true for such sites.');
      }

      // Limit content length
      const maxLength = parseInt(process.env.MAX_CONTENT_LENGTH || '50000');
      const truncatedContent = cleanedContent.length > maxLength
        ? cleanedContent.substring(0, maxLength) + '...'
        : cleanedContent;

      console.log(`✅ Scraped ${truncatedContent.length} characters from ${url}`);
      return truncatedContent;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`❌ HTTP scraping attempt ${attempt} failed:`, lastError.message);
      
      // Don't retry on 403 or other permanent errors
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        throw new Error('Failed to scrape website: Website blocked the request. Some sites (like LeetCode) have anti-scraping protection. Try a different URL or use the Playwright option with USE_PLAYWRIGHT=true.');
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed to scrape website after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

// Playwright-based scraper (for local development with dynamic content)
async function scrapeWithPlaywright(url: string): Promise<string> {
  let browser;
  
  try {
    console.log('🌐 Launching browser for:', url);
    
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
    
    console.log('✅ Browser launched successfully');

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });

    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForTimeout(2000);

    const content = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script, style, noscript');
      scripts.forEach((el) => el.remove());

      const body = document.body;
      return body.innerText || body.textContent || '';
    });

    const cleanedContent = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    const maxLength = parseInt(process.env.MAX_CONTENT_LENGTH || '50000');
    const truncatedContent = cleanedContent.length > maxLength
      ? cleanedContent.substring(0, maxLength) + '...'
      : cleanedContent;

    return truncatedContent;
  } catch (error) {
    console.error('Error scraping with Playwright:', error);
    throw new Error(`Failed to scrape website: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
