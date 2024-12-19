import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { Document } from 'src/models/document.entity';
import { UpdateRoleDto } from 'src/auth/dto/dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async updateRole(
    requesterId: number,
    userId: number,
    { role }: UpdateRoleDto,
  ) {
    const requester = await this.userRepository.findOne({
      where: { id: requesterId },
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    if (requester.role !== 'owner' && requester.role !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to update roles',
      );
    }

    if (requester.role === 'admin' && user.role === 'owner') {
      throw new ForbiddenException(
        'Admins cannot change the role of the owner',
      );
    }

    if (requester.role === 'admin' && role === 'owner') {
      throw new ForbiddenException('Admins cannot assign the owner role');
    }

    user.role = role;
    return this.userRepository.save(user);
  }

  async deleteUser(requesterId: number, userId: number) {
    const requester = await this.userRepository.findOne({
      where: { id: requesterId },
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    if (requester.role !== 'owner' && requester.role !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to delete users',
      );
    }

    if (requester.role === 'admin' && user.role === 'admin') {
      throw new ForbiddenException('Admins cannot delete other admins');
    }

    if (user.role === 'owner') {
      throw new ForbiddenException('No one can delete the owner');
    }

    await this.userRepository.delete(userId);
  }

  async deleteDocument(requesterId: number, documentId: number) {
    const requester = await this.userRepository.findOne({
      where: { id: requesterId },
    });
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['user'],
    });

    if (!document) throw new NotFoundException('Document not found');

    if (document.user.id !== requesterId && requester.role !== 'owner') {
      throw new ForbiddenException(
        'You do not have permission to delete this document',
      );
    }

    await this.documentRepository.delete(documentId);
  }

  async findUserById(userId: number) {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  // New method to get all users' details
  async getAllUsers() {
    const users = await this.userRepository.find({
      select: ['id', 'firstName', 'lastName', 'username', 'role'], // Select only required fields
    });

    if (!users) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  async clearAllData() {
    try {
      console.log('gfhjskhbvdhj');
      // Access all repositories and truncate tables (SQLite requires DELETE for clearing tables)
      await this.documentRepository.clear();
      await this.userRepository.clear();

      // Optionally: Reset auto-increment IDs in SQLite
      await this.userRepository.query(
        'DELETE FROM sqlite_sequence WHERE name="user";',
      );
      await this.documentRepository.query(
        'DELETE FROM sqlite_sequence WHERE name="document";',
      );
    } catch (error) {
      throw new Error('Failed to clear database: ' + error.message);
    }
  }
}
