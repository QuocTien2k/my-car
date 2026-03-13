import { User } from 'src/users/users.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}
