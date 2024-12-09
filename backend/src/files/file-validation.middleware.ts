import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';


@Injectable()
export class FileValidationMiddleware implements NestMiddleware {
  use(req, res, next) {
    const file = req.files[0];

    if (file.size > 10 * 1024 * 1024) { // 10 MB max
      throw new BadRequestException('File size exceeds limit');
    }

    if (!['application/pdf', 'image/jpeg', 'image/png', 'text/csv'].includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
}

    next();
  }
}
