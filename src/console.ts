import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PingerService } from './pinger.service';
import { CsvService } from './csv.service';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const pingerService = app.get(PingerService);
    const csvService = app.get(CsvService);

    console.log('Starting daily website check...');

    try {
        const csvPath = path.resolve('websites.csv');
        const urls = await csvService.readWebsitesFromCsv(csvPath);

        if (urls.length === 0) {
            console.warn('No websites found in websites.csv');
            await app.close();
            return;
        }

        const results = await pingerService.pingAndScrape(urls);

        let hasFailures = false;

        console.table(results.map(r => ({
            URL: r.url,
            Status: r.status,
            Code: r.statusCode || 'N/A',
            Error: r.error ? r.error.substring(0, 50) + '...' : ''
        })));

        for (const result of results) {
            if (result.status === 'down') {
                hasFailures = true;
                console.error(`❌ Website DOWN: ${result.url} - Error: ${result.error}`);
            } else {
                console.log(`✅ Website UP: ${result.url} (Status: ${result.statusCode})`);
            }
        }

        if (hasFailures) {
            console.error('One or more websites are down!');
            process.exit(1);
        } else {
            console.log('All websites are up and running!');
        }

    } catch (error) {
        console.error('Error running daily check:', error);
        process.exit(1);
    }

    await app.close();
}

bootstrap();
