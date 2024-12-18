import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { extractPDFText, parseCSV, parseExcel } from 'src/files/file-utils';
import { FileService } from 'src/files/files.service';

@Processor('file-upload')
@Injectable()
export class FileUploadProcessor {
  constructor(private readonly fileService: FileService) {}

  @Process('upload-file')
  async handleFileUpload(job: Job) {
    const { file, userId } = job.data;

    try {
      console.log(`Processing file: ${file.originalname}`);

      // Step 1: Save the file first with status 'PENDING'
      const savedFile = await this.fileService.saveFile(file, userId);

      // Extracted data placeholder
      let extractedData = '';

      // Step 2: Determine file type and extract data
      if (file.mimetype === 'application/pdf') {
        extractedData = await extractPDFText(savedFile.filePath); // Use saved file path
      } else if (file.mimetype === 'text/csv') {
        extractedData = await parseCSV(savedFile.filePath);
      } else if (
        file.mimetype ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel'
      ) {
        extractedData = await parseExcel(savedFile.filePath);
      }

      // Step 3: Save extracted data after processing
      await this.fileService.saveExtractedData(
        savedFile,
        userId,
        extractedData,
      );
      console.log(`File processed and updated: ${file.originalname}`);
    } catch (error) {
      console.error(`Failed to process file: ${error.message}`);
      throw error;
    }
  }
}
