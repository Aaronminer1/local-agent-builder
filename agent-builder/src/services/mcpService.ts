/**
 * MCP Service - Integration with Model Context Protocol servers
 * Provides access to MCP tools like Playwright for workflow execution
 */

import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';

class MCPService {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * Initialize the MCP service with Playwright
   */
  async initialize(): Promise<void> {
    try {
      console.log('🎭 Initializing MCP Playwright service...');
      this.browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      console.log('✅ MCP Playwright service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize MCP Playwright:', error);
      throw error;
    }
  }

  /**
   * Navigate to a URL and extract content
   */
  async navigateAndExtract(url: string): Promise<string> {
    if (!this.page) {
      await this.initialize();
    }

    try {
      console.log(`🌐 MCP Playwright navigating to: ${url}`);
      
      await this.page!.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });

      // Wait a bit for dynamic content
      await this.page!.waitForTimeout(2000);

      // Extract text content
      const title = await this.page!.title();
      const content = await this.page!.evaluate(() => {
        // Remove script and style elements
        const scripts = document.querySelectorAll('script, style, nav, footer, header');
        scripts.forEach(el => el.remove());
        
        // Get main content
        const main = document.querySelector('main') || 
                    document.querySelector('[role="main"]') || 
                    document.querySelector('.content') ||
                    document.querySelector('#content') ||
                    document.body;
        
        return main?.innerText?.slice(0, 2000) || 'No content found';
      });

      return `Title: ${title}\n\nContent:\n${content}\n\nSource: ${url}`;
    } catch (error) {
      console.error('❌ MCP Playwright navigation error:', error);
      return `Error navigating to ${url}: ${error}`;
    }
  }

  /**
   * Search Google and extract results
   */
  async searchGoogle(query: string): Promise<string> {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    
    if (!this.page) {
      await this.initialize();
    }

    try {
      console.log(`🔍 MCP Playwright searching Google: ${query}`);
      
      await this.page!.goto(searchUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });

      // Wait for results to load
      await this.page!.waitForTimeout(2000);

      // Extract search results
      const results = await this.page!.evaluate(() => {
        const searchResults: Array<{title: string, snippet: string, url: string}> = [];
        
        // Try different selectors for search results
        const resultSelectors = [
          'div[data-ved] h3',
          '.g h3',
          '[data-header-feature] h3',
          'h3'
        ];
        
        for (const selector of resultSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            elements.forEach((el, index) => {
              if (index < 5) { // Limit to 5 results
                const titleEl = el as HTMLElement;
                const linkEl = titleEl.closest('a') || titleEl.querySelector('a');
                const parentDiv = titleEl.closest('div[data-ved], .g, [data-header-feature]');
                const snippetEl = parentDiv?.querySelector('span, div:not(:has(h3))');
                
                if (titleEl.textContent && linkEl?.href) {
                  searchResults.push({
                    title: titleEl.textContent.trim(),
                    snippet: snippetEl?.textContent?.trim()?.slice(0, 200) || '',
                    url: linkEl.href
                  });
                }
              }
            });
            break; // Use first working selector
          }
        }
        
        return searchResults;
      });

      if (results.length === 0) {
        return `No search results found for "${query}". Google may have blocked the request or changed their structure.`;
      }

      // Format results
      const formattedResults = results.map((result, index) => {
        return `${index + 1}. ${result.title}\n   ${result.snippet}\n   ${result.url}`;
      }).join('\n\n');

      return `Google search results for "${query}":\n\n${formattedResults}\n\nSource: Google Search via MCP Playwright`;
    } catch (error) {
      console.error('❌ MCP Playwright search error:', error);
      return `Error searching Google for "${query}": ${error}`;
    }
  }

  /**
   * Search a news site for current information
   */
  async searchNews(query: string): Promise<string> {
    // Try multiple news sources
    const newsSources = [
      `https://www.bbc.com/search?q=${encodeURIComponent(query)}`,
      `https://www.cnn.com/search?q=${encodeURIComponent(query)}`,
      `https://techcrunch.com/search/${encodeURIComponent(query)}/`
    ];

    for (const newsUrl of newsSources) {
      try {
        const result = await this.navigateAndExtract(newsUrl);
        if (result && !result.includes('Error')) {
          return `News search results for "${query}":\n\n${result}`;
        }
      } catch (error) {
        console.log(`Failed to search ${newsUrl}, trying next...`);
      }
    }

    return `Unable to fetch current news for "${query}". News sites may be blocking automated access.`;
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      console.log('🧹 MCP Playwright service cleaned up');
    } catch (error) {
      console.error('❌ Error cleaning up MCP service:', error);
    }
  }
}

// Export singleton instance
export const mcpService = new MCPService();
