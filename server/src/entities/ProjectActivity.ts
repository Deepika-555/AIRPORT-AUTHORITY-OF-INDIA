import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'project_activities' }) // Explicitly set the table name
export class ProjectActivity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  project_name!: string;

  @Column()
  activity_name!: string;

  @Column()
  subactivity_name!: string;

  @Column('float')
  percentage!: number;

  @Column('boolean')
  maker_status!: boolean;

  @Column('boolean')
  checker_status!: boolean;

  @Column('boolean')
  approver_status!: boolean;
}