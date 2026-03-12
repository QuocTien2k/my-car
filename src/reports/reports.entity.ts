import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number; // ID của bản ghi xe (tự tăng)

  @Column()
  price: number; // Giá bán của xe

  @Column()
  make: string; // Hãng xe (Toyota, Honda, Ford...)

  @Column()
  model: string; // Dòng xe / mẫu xe (Vios, Civic, Ranger...)

  @Column()
  year: number; // Năm sản xuất của xe

  @Column()
  lng: number; // Kinh độ vị trí nơi bán xe

  @Column()
  lat: number; // Vĩ độ vị trí nơi bán xe

  @Column()
  mileage: number; // Số km xe đã chạy

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
