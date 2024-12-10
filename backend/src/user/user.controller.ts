import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserResponseDto } from 'src/auth/dto/dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UserService } from './user.service';
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get('profile')
  async profile(
    @Req() req: any,
  ): Promise<{ status: string; data: UserResponseDto | null }> {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new HttpException(
          'Access token not found',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = authorizationHeader.replace('Bearer ', '');
      const payload = this.userService.verifyToken(token);

      if (!payload) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      const userId = payload.sub;
      const profile = await this.userService.getProfile(userId);

      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.UNAUTHORIZED); // Return 401 if profile is not found
      }

      return {
        status: 'success',
        data: profile,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
