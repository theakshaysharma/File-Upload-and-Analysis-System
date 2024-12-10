import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto, RegisterDto, UserResponseDto } from './dto/dto';
import { User } from 'src/models/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    const { firstName, lastName, username, email, password } = registerDto;
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }]
    });

    if (existingUser) {
      throw new BadRequestException('Username or email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ username, email, password: hashedPassword, firstName, lastName });
    await this.userRepository.save(newUser);

    return { id: newUser.id, username: newUser.username, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName };
  }

  async validateUser(userIdentifier: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ username: userIdentifier }, { email: userIdentifier }]
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; 
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<{ status: string; data: UserResponseDto }> {
    const { userIdentifier, password } = loginDto;
    const user = await this.validateUser(userIdentifier, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return {
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accessToken: accessToken
      }
    };
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getProfile(userId: number): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return null;
    return { id: user.id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName };
  }
}
