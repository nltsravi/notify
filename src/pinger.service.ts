import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface PingResult {
    url: string;
    status: 'up' | 'down';
    statusCode?: number;
    headerContent?: string;
    footerContent?: string;
    error?: string;
}

@Injectable()
export class PingerService {
    private readonly logger = new Logger(PingerService.name);

    async pingAndScrape(urls: string[]): Promise<PingResult[]> {
        const results: PingResult[] = [];

        for (const url of urls) {
            try {
                const response = await axios.get(url, { timeout: 5000 });
                const html = response.data;
                const $ = cheerio.load(html);

                const headerContent = $('header').html() || 'No <header> tag found';
                const footerContent = $('footer').html() || 'No <footer> tag found';

                results.push({
                    url,
                    status: 'up',
                    statusCode: response.status,
                    headerContent: headerContent.substring(0, 500) + (headerContent.length > 500 ? '...' : ''), // Truncate for brevity
                    footerContent: footerContent.substring(0, 500) + (footerContent.length > 500 ? '...' : ''),
                });
            } catch (error) {
                this.logger.error(`Failed to ping ${url}: ${error.message}`);
                results.push({
                    url,
                    status: 'down',
                    error: error.message,
                });
            }
        }

        return results;
    }
}
