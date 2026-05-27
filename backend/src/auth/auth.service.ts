import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

interface User {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: User[] = [];

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user: User = {
      id: Date.now(),
      email: dto.email,
      password: hashedPassword,
    };

    this.users.push(user);

    return {
      message: 'User registered successfully',
    };
  }

  async login(dto: LoginDto) {
    const user = this.users.find((u: User) => u.email === dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login success',
      userId: user.id,
    };
  }
}
