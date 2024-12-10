import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { UserService } from './user.service';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { UserController } from './user.controller';
import { Document } from 'src/models/document.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY', // Use a secure key stored in `.env`
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User, Document]),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
})
export class UserModule {}
