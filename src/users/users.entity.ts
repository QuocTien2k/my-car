import { Exclude } from 'class-transformer';
import { UserRole } from 'src/enum/user-role.enum';
import { Report } from 'src/reports/reports.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({
    type: 'text',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
