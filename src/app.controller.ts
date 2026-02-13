import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CsvService } from './csv.service';
import { PingResult, PingerService } from './pinger.service';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly csvService: CsvService,
    private readonly pingerService: PingerService,
  ) { }

  @Get()
  async checkWebsites(): Promise<PingResult[]> {
    const csvPath = path.resolve('websites.csv');
    const urls = await this.csvService.readWebsitesFromCsv(csvPath);
    return this.pingerService.pingAndScrape(urls);
  }
}
