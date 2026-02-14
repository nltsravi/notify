"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const pinger_service_1 = require("./pinger.service");
const csv_service_1 = require("./csv.service");
const email_service_1 = require("./email.service");
const path = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const pingerService = app.get(pinger_service_1.PingerService);
    const csvService = app.get(csv_service_1.CsvService);
    const emailService = app.get(email_service_1.EmailService);
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
        let emailBody = '<h2>Website Status Report</h2><table border="1" cellpadding="5" cellspacing="0"><thead><tr><th>URL</th><th>Status</th><th>Code</th><th>Error</th></tr></thead><tbody>';
        for (const result of results) {
            const color = result.status === 'down' ? 'red' : 'green';
            emailBody += `<tr>
                <td>${result.url}</td>
                <td style="color: ${color}; font-weight: bold;">${result.status.toUpperCase()}</td>
                <td>${result.statusCode || 'N/A'}</td>
                <td>${result.error || ''}</td>
            </tr>`;
            if (result.status === 'down') {
                hasFailures = true;
                console.error(`❌ Website DOWN: ${result.url} - Error: ${result.error}`);
            }
            else {
                console.log(`✅ Website UP: ${result.url} (Status: ${result.statusCode})`);
            }
        }
        emailBody += '</tbody></table>';
        const subject = hasFailures ? '🚨 Website Status Alert: Some sites are DOWN' : '✅ Website Status Report: All sites are UP';
        await emailService.sendEmail(subject, emailBody);
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