export interface PingResult {
    url: string;
    status: 'up' | 'down';
    statusCode?: number;
    headerContent?: string;
    footerContent?: string;
    error?: string;
}
export declare class PingerService {
    private readonly logger;
    pingAndScrape(urls: string[]): Promise<PingResult[]>;
}
