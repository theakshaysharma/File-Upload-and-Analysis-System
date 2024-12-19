import { readFileSync } from 'fs';
import { PDFDocument } from 'pdf-lib';
import Tesseract from 'tesseract.js';
import { parse } from 'papaparse';
import * as xlsx from 'xlsx';
import * as pdfParse from 'pdf-parse';
import * as fs from 'fs';
import * as path from 'path';
const BASE_PATH = path.resolve(__dirname, '../../..');
// PDF Text Extraction
export async function extractPDFText(filePath: string): Promise<string> {
  // Use path.join to ensure the correct file path
  
  const fullPath = path.join(BASE_PATH, filePath);
  console.log('extractpdf',fullPath);
  const fileData = fs.readFileSync(fullPath); // Read the file

  const pdfData = await pdfParse(fileData); // Parse the PDF file
  return pdfData.text; // Extracted text
}


export async function extractImageText(file: Express.Multer.File): Promise<string> {
  try {
    // Construct the absolute file path
    const filePath = path.join(BASE_PATH, 'uploads', file.filename);
    console.log('Extracting text from file at:', filePath);

    // Use Tesseract to recognize text from the image file
    const result = await Tesseract.recognize(
      filePath,
      'eng',
      { logger: (m) => console.log(m) } // Optional: log the progress
    );

    return result.data.text;
  } catch (error) {
    console.error('Error during OCR processing:', error);
    throw new Error('Failed to recognize text from image');
  }
}




// CSV Parsing
export async function parseCSV(filePath: string): Promise<any[]> {
  const fileData = readFileSync(filePath, 'utf8');
  const { data } = parse(fileData, { header: true });
  return data;
}

// Excel Parsing
export async function parseExcel(filePath: string): Promise<any[]> {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
}
