import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';

@Injectable()
export class CsvService {
  async readWebsitesFromCsv(filePath: string): Promise<string[]> {
    const results: string[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            if (data.url) {
                results.push(data.url);
            }
        })
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
}
