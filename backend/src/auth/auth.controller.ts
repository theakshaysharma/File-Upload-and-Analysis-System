import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UserResponseDto } from './dto/dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ status: string; data: UserResponseDto }> {
    const result = await this.authService.login(loginDto);
    return {
      status: 'success',
      data: result.data,
    };
  }

 

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any): Promise<{ status: string; data: UserResponseDto | null }> {
    try {
      const authorizationHeader = req.headers.authorization;
      console.log('authorizationHeader',authorizationHeader)
      if (!authorizationHeader) {
        throw new HttpException('Access token not found', HttpStatus.UNAUTHORIZED);
      }

      const token = authorizationHeader.replace('Bearer ', '');
      const payload = this.authService.verifyToken(token);

      if (!payload) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }




      const userId =                       payload.sub;
      const profile = await this.authService.getProfile(userId);
      if (profile) {
        return {
          status: 'success',
          data: profile,
        };
      } else {
        return {
          status: 'error',
          data: null,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
