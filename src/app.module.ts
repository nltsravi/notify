import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsvService } from './csv.service';
import { PingerService } from './pinger.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CsvService, PingerService],
})
export class AppModule { }
