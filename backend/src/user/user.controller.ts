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

  @Put('role/:id')
  async updateRole(
    @Req() req: any,
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const requestingUserId = req.user.id;
    const updatedUser = await this.userService.updateRole(
      requestingUserId,
      id,
      updateRoleDto,
    );

    return {
      status: 'success',
      data: updatedUser,
    };
  }

  @Delete(':id')
  async deleteUser(@Req() req: any, @Param('id') id: number) {
    console.log('here', id);
    const requestingUserId = req.user.id;
    await this.userService.deleteUser(requestingUserId, id);

    return {
      status: 'success',
      message: 'User deleted successfully',
    };
  }

  @Delete('document/:id')
  async deleteDocument(@Req() req: any, @Param('id') documentId: number) {
    const requestingUserId = req.user.id;
    await this.userService.deleteDocument(requestingUserId, documentId);

    return {
      status: 'success',
      message: 'Document deleted successfully',
    };
  }

  @Get('all')
  async getAllUsers(@Req() req: any) {
    const requestingUserId = req.user.id;
    const requestingUser =
      await this.userService.findUserById(requestingUserId);

    if (!requestingUser) {
      throw new UnauthorizedException('User not found');
    }

    // Check if the requesting user is an admin or owner
    if (requestingUser.role !== 'admin' && requestingUser.role !== 'owner') {
      throw new ForbiddenException(
        'You do not have permission to view all users',
      );
    }

    const users = await this.userService.getAllUsers();
    return {
      status: 'success',
      data: users,
    };
  }
}
