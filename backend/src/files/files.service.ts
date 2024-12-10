import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document, DocumentStatus } from 'src/models/document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Document)
    private fileRepository: Repository<Document>,
  ) {}

  async uploadFiles(
    files: Express.Multer.File[],
    userId: string, // UserId is sent directly
  ): Promise<any> {
    const fileDataPromises = files.map(async (file) => {
      const newFile = this.fileRepository.create({
        fileName: file.originalname,
        fileType: file.mimetype,
        filePath: `uploads/${file.filename ?? file.originalname}`,
        status: DocumentStatus.PENDING,
        userId, // Assign the userId directly
      });

      await this.fileRepository.save(newFile);
      return newFile;
    });

    return await Promise.all(fileDataPromises);
  }

  async getFiles(
    page: number,
    limit: number,
  ): Promise<{ data: Document[]; total: number }> {
    const [data, total] = await this.fileRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async getFileDetails(id: number): Promise<Document> {
    const document = await this.fileRepository.findOne({
      where: { id },
      relations: ['user'], // Assuming `user` is a relation in the `Document` entity
    });

    return document;
  }
}
