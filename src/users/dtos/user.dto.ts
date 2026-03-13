import { Expose } from 'class-transformer';

//class hiển thị field user
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  role: string;
}
