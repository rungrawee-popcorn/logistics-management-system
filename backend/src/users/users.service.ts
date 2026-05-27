import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUsers() {
    return {
      message: 'Users module working',
      data: [],
    };
  }
}
