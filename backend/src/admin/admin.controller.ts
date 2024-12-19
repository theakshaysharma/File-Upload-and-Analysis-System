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
import { JwtAuthGuard } from 'src/guards/jwt.guards';
import { UpdateRoleDto } from 'src/auth/dto/dto';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put('role/:id')
  async updateRole(
    @Req() req: any,
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const requestingUserId = req.user.id;
    const updatedUser = await this.adminService.updateRole(
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
    await this.adminService.deleteUser(requestingUserId, id);

    return {
      status: 'success',
      message: 'User deleted successfully',
    };
  }

  @Delete('document/:id')
  async deleteDocument(@Req() req: any, @Param('id') documentId: number) {
    const requestingUserId = req.user.id;
    await this.adminService.deleteDocument(requestingUserId, documentId);

    return {
      status: 'success',
      message: 'Document deleted successfully',
    };
  }

  @Delete('clear-all')
  async clearAllData(@Req() req: any) {
    console.log('here in controller');
    const requestingUserId = req.user.id;

    // Validate admin or owner
    const requestingUser =
      await this.adminService.findUserById(requestingUserId);
    if (
      requestingUser.id !== 1 && // Owner ID check
      requestingUser.role !== 'owner'
    ) {
      throw new ForbiddenException('Only the owner can perform this action');
    }

    await this.adminService.clearAllData();

    return {
      status: 'success',
      message: 'All data has been cleared successfully',
    };
  }

  @Get('all')
  async getAllUsers(@Req() req: any) {
    const requestingUserId = req.user.id;
    const requestingUser =
      await this.adminService.findUserById(requestingUserId);

    if (!requestingUser) {
      throw new UnauthorizedException('User not found');
    }

    // Check if the requesting user is an admin or owner
    if (requestingUser.role !== 'admin' && requestingUser.role !== 'owner') {
      throw new ForbiddenException(
        'You do not have permission to view all users',
      );
    }

    const users = await this.adminService.getAllUsers();
    return {
      status: 'success',
      data: users,
    };
  }
}
