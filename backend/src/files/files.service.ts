import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document, DocumentStatus } from 'src/models/document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Document)
    private fileRepository: Repository<Document>
  ) {}

  async uploadFiles(files: Express.Multer.File[]): Promise<any> {
    // Log the received files to check if they are being passed correctly
    console.log('Received files:', files);

    const fileDataPromises = files.map(async (file) => {
      // Log individual file details to check their properties
      console.log('Processing file:', file);

      const newFile = this.fileRepository.create({
        fileName: file.originalname,
        fileType: file.mimetype,
        filePath: `uploads/${file.filename}`,
        status: DocumentStatus.PENDING,
      });

      await this.fileRepository.save(newFile);
      return newFile;
    });

    return await Promise.all(fileDataPromises);
}


  async getFiles(page: number, limit: number): Promise<{ data: Document[]; total: number }> {
    const [data, total] = await this.fileRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async getFileDetails(id: number): Promise<Document> {
    const document = await this.fileRepository.findOne({
      where: { id },
      relations: ['user'], 
        });
  
    return document;
  }
  
  
}
