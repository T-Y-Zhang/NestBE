import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(email: string, name: string, password: string) {
    const found = await this.usersService.findOneByEmail(email);
    if (found) {
      throw new ConflictException();
    }
    const user = await this.usersService.create(name, email, password);
    const payload = { email: email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
