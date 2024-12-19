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
    @InjectQueue('file-upload') private readonly fileUploadQueue: Queue,
  ) {}

  async uploadFiles(
    files: Express.Multer.File[],
    userId: string,
  ): Promise<any> {
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
    file: Express.Multer.File | any,
    userId: string,
    extractedData: string,
  ): Promise<Document> {
    const existingFile = await this.fileRepository.findOne({
      where: { filePath: file.filePath, userId },
    });
    console.log('coming here saveExtractedData', existingFile);

    if (!existingFile) {
      throw new Error(
        `File with name ${file.originalname} not found for user ${userId}`,
      );
    }

    // Update the extractedData field and status
    existingFile.extractedData = extractedData;
    existingFile.status = DocumentStatus.COMPLETED;
    return this.fileRepository.save(existingFile);
  }

  async getFiles(params: {
    userId: number;
    page?: number;
    limit?: number;
    fileName?: string;
    fileType?: string;
  }): Promise<{ data: Document[]; total: number }> {
    try {
      const { userId, page, limit, fileName, fileType } = params;

      const queryBuilder = this.fileRepository.createQueryBuilder('file');

      // Filter files by userId
      queryBuilder.where('file.userId = :userId', { userId });

      // Add filters for fileName and fileType
      if (fileName) {
        queryBuilder.andWhere('file.fileName LIKE :fileName', {
          fileName: `%${fileName}%`,
        });
      }
      if (fileType) {
        queryBuilder.andWhere('file.fileType = :fileType', { fileType });
      }

      // Add pagination if page and limit are provided
      if (page && limit) {
        queryBuilder.skip((page - 1) * limit).take(limit);
      }

      const [data, total] = await queryBuilder.getManyAndCount();
      return { data, total };
    } catch (e) {
      console.log('erroe here', e);
      throw e;
    }
  }

  async getFileDetails(id: number): Promise<Document> {
    const document = await this.fileRepository.findOne({
      where: { id },
      relations: ['user'], // Assuming `user` is a relation in the `Document` entity
    });
    console.log('document', document);
    return document;
  }

  async deleteFile(id: number, userId: number): Promise<boolean> {
    const file = await this.fileRepository.findOne({
      where: { id, userId: JSON.stringify(userId) },
    });

    if (!file) {
      return false;
    }

    await this.fileRepository.delete(id);
    return true;
  }
}
