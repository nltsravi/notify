"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PingerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingerService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const cheerio = require("cheerio");
let PingerService = PingerService_1 = class PingerService {
    logger = new common_1.Logger(PingerService_1.name);
    async pingAndScrape(urls) {
        const results = [];
        for (const url of urls) {
            try {
                const response = await axios_1.default.get(url, { timeout: 5000 });
                const html = response.data;
                const $ = cheerio.load(html);
                const headerContent = $('header').html() || 'No <header> tag found';
                const footerContent = $('footer').html() || 'No <footer> tag found';
                results.push({
                    url,
                    status: 'up',
                    statusCode: response.status,
                    headerContent: headerContent.substring(0, 500) + (headerContent.length > 500 ? '...' : ''),
                    footerContent: footerContent.substring(0, 500) + (footerContent.length > 500 ? '...' : ''),
                });
            }
            catch (error) {
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
};
exports.PingerService = PingerService;
exports.PingerService = PingerService = PingerService_1 = __decorate([
    (0, common_1.Injectable)()
], PingerService);
//# sourceMappingURL=pinger.service.js.map