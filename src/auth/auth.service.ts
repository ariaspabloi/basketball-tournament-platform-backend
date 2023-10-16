import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException('Clave incorrecta');
    }
    //TODO: return role? role_ID?
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role.role_name,
      isAdmin: user.role.role_name === 'Administrador',
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: user.role.role_name,
      name: user.name,
      email: user.email,
    };
  }
}
