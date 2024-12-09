import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Document, DocumentStatus } from './document.entity';

@Entity('process_files')
export class ProcessFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Document, { onDelete: 'CASCADE' })
  document: Document;

  @Column()
  jobId: string; // Unique identifier for the job in the queue

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;

  @Column('text', { nullable: true })
  error: string; // Stores error message in case of failure

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
}
