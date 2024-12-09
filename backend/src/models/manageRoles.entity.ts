import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('role_changes')
export class RoleChange {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  changedBy: User; // User who initiated the role change

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  targetUser: User; // User whose role is changed

  @Column()
  oldRole: string;

  @Column()
  newRole: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
