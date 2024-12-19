import { Process, Processor } from "@nestjs/bull";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { extractImageText, extractPDFText, parseCSV, parseExcel } from "src/files/file-utils";
import { FileService } from "src/files/files.service";

@Processor('file-upload')
@Injectable()
export class FileUploadProcessor implements OnModuleInit {
  private fileUploadQueue: Queue;

  constructor(private readonly fileService: FileService) {
    this.fileUploadQueue = new Queue('file-upload', {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT,10) ?? 6379,
      },
    });
  }

  async onModuleInit() {
    try {
      console.log('Clearing the file-upload queue...');
      await this.fileUploadQueue.drain();
      console.log('Queue cleared successfully');
    } catch (error) {
      console.error(`Failed to clear the queue: ${error.message}`);
    }
  }

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
    } else if (file.mimetype.startsWith('image/')) {
      extractedData = await extractImageText(file); // Pass the file object to the function
    } else if (file.mimetype === 'text/csv') {
      extractedData = JSON.stringify(await parseCSV(savedFile.filePath)); // Use saved file path
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      extractedData = JSON.stringify(await parseExcel(savedFile.filePath)); // Use saved file path
    }

    // Step 3: Save extracted data after processing
    await this.fileService.saveExtractedData(savedFile, userId, extractedData);
    console.log(`File processed and updated: ${file.originalname}`);
  } catch (error) {
    console.error(`Failed to process file: ${error.message}`);
    throw error;
  }
}

}
