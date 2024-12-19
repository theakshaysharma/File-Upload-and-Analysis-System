import * as pdfParse from 'pdf-parse';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import * as xlsx from 'xlsx';

const BASE_PATH = path.resolve(__dirname, '../../..');

// PDF Text Extraction
export async function extractPDFText(filePath: string): Promise<string> {
  const fullPath = path.join(BASE_PATH, filePath);
  console.log('extractpdf', fullPath);
  const fileData = fs.readFileSync(fullPath);

  const pdfData = await pdfParse(fileData);
  return pdfData.text;
}

// CSV Parsing
export async function parseCSV(filePath: string): Promise<string> {
  const fullPath = path.join(BASE_PATH, filePath);
  console.log('parseCSV', fullPath);
  return new Promise((resolve, reject) => {
    const results: string[] = [];
    fs.createReadStream(fullPath)
      .pipe(csvParser())
      .on('data', (data) => results.push(JSON.stringify(data)))
      .on('end', () => resolve(results.join('\n')))
      .on('error', (err) => reject(err));
  });
}

// Excel Parsing
export async function parseExcel(filePath: string): Promise<string> {
  const fullPath = path.join(BASE_PATH, filePath);
  console.log('parseExcel', fullPath);

  const workbook = xlsx.readFile(fullPath);
  const sheetNames = workbook.SheetNames;

  const data: string[] = [];
  sheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    data.push(JSON.stringify(sheetData));
  });

  return data.join('\n');
}
