import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { RegisterDto, UserResponseDto } from 'src/auth/dto/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}


    verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token 1234');
    }
  }

  async getProfile(userId: number): Promise<UserResponseDto | null | any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['documents'], // Include related documents
    });

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      documents: user.documents.map((doc) => ({
        id: doc.id,
        fileName: doc.fileName,
        fileType: doc.fileType,
        filePath: doc.filePath,
        status: doc.status,
        createdAt: doc.createdAt,
      })),
    };
  }
}
