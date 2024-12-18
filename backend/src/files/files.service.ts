import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Document, DocumentStatus } from 'src/models/document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Document)
    private fileRepository: Repository<Document>,
     @InjectQueue('file-upload') private readonly fileUploadQueue: Queue
  ) {}

  async uploadFiles(files: Express.Multer.File[], userId: string): Promise<any> {
  const jobs = files.map((file) =>
    this.fileUploadQueue.add('upload-file', { file, userId }),
  );

  return Promise.all(jobs);
}


 async saveFile(file: Express.Multer.File, userId: string): Promise<any> {
  const filePath = `uploads/${file.filename ?? file.originalname}`; // Ensure this path is correct
  const newFile = this.fileRepository.create({
    fileName: file.originalname,
    fileType: file.mimetype,
    filePath: filePath, // Store the correct file path
    status: DocumentStatus.PENDING,
    userId,
  });

  await this.fileRepository.save(newFile);
  return newFile; // Ensure to return the file with the filePath
}



async saveExtractedData(
  file: Express.Multer.File |any,
  userId: string,
  extractedData: string
): Promise<Document> {
  
  const existingFile = await this.fileRepository.findOne({
    where: { filePath: file.filePath, userId }, 
  });
console.log('coming here saveExtractedData',existingFile);

  if (!existingFile) {
    throw new Error(`File with name ${file.originalname} not found for user ${userId}`);
  }

  // Update the extractedData field and status
  existingFile.extractedData = extractedData;
  existingFile.status = DocumentStatus.COMPLETED; 
  return this.fileRepository.save(existingFile);
}




  async getFiles(
    page: number,
    limit: number,
  ): Promise<{ data: Document[]; total: number }> {
    const [data, total] = await this.fileRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    console.log('data',data,'total',total)
    return { data, total };
  }

  async getFileDetails(id: number): Promise<Document> {
    const document = await this.fileRepository.findOne({
      where: { id },
      relations: ['user'], // Assuming `user` is a relation in the `Document` entity
    });
console.log('document',document)
    return document;
  }
}
