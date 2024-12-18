import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadProcessor } from './file-upload.processor';

describe('FileUploadProcessor', () => {
  let provider: FileUploadProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileUploadProcessor],
    }).compile();

    provider = module.get<FileUploadProcessor>(FileUploadProcessor);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
