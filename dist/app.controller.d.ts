import { AppService } from './app.service';
import { CsvService } from './csv.service';
import { PingResult, PingerService } from './pinger.service';
export declare class AppController {
    private readonly appService;
    private readonly csvService;
    private readonly pingerService;
    constructor(appService: AppService, csvService: CsvService, pingerService: PingerService);
    checkWebsites(): Promise<PingResult[]>;
}
