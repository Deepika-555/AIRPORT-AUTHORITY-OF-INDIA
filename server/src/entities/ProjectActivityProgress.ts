import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ProjectActivityProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true }) // Allow NULL values
  project_name!: string;

  @Column()
  activity_name!: string;

  @Column('float')
  progress!: number;

  @Column('boolean')
  activity_status!: boolean;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}