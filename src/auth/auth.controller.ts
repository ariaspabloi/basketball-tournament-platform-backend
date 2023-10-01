import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { Roles } from './roles/roles.decorator';
import { Role } from './roles/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: SigninAuthDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Roles(Role.Any)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Roles(Role.Club)
  @Get('club-test')
  getClubTest(@Request() req) {
    return req.user;
  }

  @Roles(Role.Organizer)
  @Get('organizer-test')
  getOrganizerTest(@Request() req) {
    return req.user;
  }

  @Roles(Role.Administrator)
  @Get('administrator-test')
  getAdministratorTest(@Request() req) {
    return req.user;
  }

  @Get('public-test')
  getPublicTest() {
    return 'public-test';
  }
}
