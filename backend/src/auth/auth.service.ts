import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto, UserResponseDto } from './dto/dto';

interface User {
  id: number;
  username: string;
  email: string;
  password: string; // This should be hashed
}

@Injectable()
export class AuthService {
  private users: User[] = []; // Mock database. Replace with a real database connection.

  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto:RegisterDto): Promise<UserResponseDto> {
    // Check if the user already exists
    const { username, email, password } = registerDto;
    const existingUser = this.users.find((user) => user.username === username || user.email === email);
    if (existingUser) {
      throw new BadRequestException('Username or email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, email, password: hashedPassword };
    this.users.push(newUser);

    return { id: newUser.id, username: newUser.username, email: newUser.email };
  }

  async validateUser(userIdentifier:string, password: string): Promise<User | null> {
    const user = this.users.find((u) => u.username === userIdentifier || u.email === userIdentifier);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { ...user, password: undefined }; // Exclude the password
    }
    return null;
  }

  async login(loginDto:LoginDto): Promise<{ accessToken: string }> {
    const { userIdentifier,password } = loginDto;
    console.log(loginDto,userIdentifier,password);
    const user = await this.validateUser(userIdentifier, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async getProfile(userId: number): Promise<UserResponseDto | null> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;
    return { id: user.id, username: user.username, email: user.email };
  }
}
