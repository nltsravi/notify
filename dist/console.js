"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const pinger_service_1 = require("./pinger.service");
const csv_service_1 = require("./csv.service");
const path = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const pingerService = app.get(pinger_service_1.PingerService);
    const csvService = app.get(csv_service_1.CsvService);
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
            }
            else {
                console.log(`✅ Website UP: ${result.url} (Status: ${result.statusCode})`);
            }
        }
        if (hasFailures) {
            console.error('One or more websites are down!');
            process.exit(1);
        }
        else {
            console.log('All websites are up and running!');
        }
    }
    catch (error) {
        console.error('Error running daily check:', error);
        process.exit(1);
    }
    await app.close();
}
bootstrap();
//# sourceMappingURL=console.js.map