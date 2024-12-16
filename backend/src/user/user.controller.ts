import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt.guards';
import { UpdateProfileDto, UpdateRoleDto } from 'src/auth/dto/dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async profile(@Req() req: any) {
    const userId = req.user.id;
    const profile = await this.userService.getProfile(userId);

    if (!profile) {
      throw new UnauthorizedException('Profile not found');
    }

    return {
      status: 'success',
      data: profile,
    };
  }

  @Put('profile')
  async updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    const updatedProfile = await this.userService.updateProfile(
      userId,
      updateProfileDto,
    );

    return {
      status: 'success',
      data: updatedProfile,
    };
  }

  
}
