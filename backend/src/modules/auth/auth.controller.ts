import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from '../../dtos/signup.dto';
import { LoginDto } from '../../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
}